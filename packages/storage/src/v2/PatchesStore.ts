import {
	createCompoundIndexValue,
	createLowerBoundIndexValue,
	createUpperBoundIndexValue,
	getOidRange,
	getOidRoot,
	ObjectIdentifier,
	OperationPatch,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';

type ClientPatch = OperationPatch & {
	replicaId: string;
	operationId: string;
};

type StoredPatch = ClientPatch & {
	oid_timestamp: string;
	replicaId_timestamp: string;
};

export class PatchesStore {
	constructor(private readonly db: IDBDatabase) {}

	/**
	 * Iterates over every patch for the root and every sub-object
	 * of a given document. Optionally limit by timestamp.
	 */
	iterateOverAllPatchesForDocument = async (
		oid: ObjectIdentifier,
		iterator: (patch: OperationPatch, store: IDBObjectStore) => void,
		{
			to,
			from,
			after,
			mode = 'readonly',
		}: {
			to?: string;
			from?: string;
			after?: string;
			mode?: 'readwrite' | 'readonly';
		} = {},
	): Promise<void> => {
		const transaction = this.db.transaction('patches', mode);
		const store = transaction.objectStore('patches');
		const index = store.index('oid_timestamp');

		const [startOid, endOid] = getOidRange(oid);
		const startTimestamp = from || after;
		const start = startTimestamp
			? createCompoundIndexValue(startOid, startTimestamp)
			: createLowerBoundIndexValue(startOid);
		const end = to
			? createCompoundIndexValue(endOid, to)
			: createUpperBoundIndexValue(endOid);

		const range = IDBKeyRange.bound(start, end, !from, !to);

		const request = index.openCursor(range, 'next');
		return new Promise<void>((resolve, reject) => {
			let previousTimestamp: string | undefined;
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					const value = cursor.value as StoredPatch;
					assert(value.oid.startsWith(oid));
					assert(
						previousTimestamp === undefined ||
							previousTimestamp <= value.timestamp,
						`expected ${previousTimestamp} <= ${value.timestamp}`,
					);

					iterator(value, store);
					previousTimestamp = value.timestamp;
					cursor.continue();
				} else {
					resolve();
				}
			};
			request.onerror = (event) => {
				reject(event);
			};
		});
	};

	iterateOverAllPatchesForReplica = async (
		replicaId: string,
		iterator: (patch: ClientPatch, store: IDBObjectStore) => void,
		{
			before,
		}: {
			before?: string;
		},
	): Promise<void> => {
		const transaction = this.db.transaction('patches', 'readonly');
		const store = transaction.objectStore('patches');
		const index = store.index('replicaId_timestamp');

		const start = createLowerBoundIndexValue(replicaId);
		const end = before
			? createCompoundIndexValue(replicaId, before)
			: createUpperBoundIndexValue(replicaId);

		const range = IDBKeyRange.bound(start, end, false, true);

		const request = index.openCursor(range, 'next');
		return new Promise<void>((resolve, reject) => {
			let previousTimestamp: string | undefined;
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					const value = cursor.value as StoredPatch;
					assert(value.replicaId === replicaId);
					assert(
						previousTimestamp === undefined ||
							previousTimestamp <= value.timestamp,
						`expected ${previousTimestamp} <= ${value.timestamp}`,
					);

					iterator(value, store);
					previousTimestamp = value.timestamp;
					cursor.continue();
				} else {
					resolve();
				}
			};
			request.onerror = (event) => {
				reject(event);
			};
		});
	};

	/**
	 * Adds a set of patches to the database.
	 * @returns a list of affected root document OIDs.
	 */
	addPatches = async (patches: ClientPatch[]): Promise<ObjectIdentifier[]> => {
		return this.insertPatches(patches.map(this.addCompoundIndexes));
	};

	private addCompoundIndexes = (patch: ClientPatch): StoredPatch => {
		return {
			...patch,
			oid_timestamp: createCompoundIndexValue(
				patch.oid,
				patch.timestamp,
			) as string,
			replicaId_timestamp: createCompoundIndexValue(
				patch.replicaId,
				patch.timestamp,
			) as string,
		};
	};

	private insertPatches = async (
		patches: StoredPatch[],
	): Promise<ObjectIdentifier[]> => {
		const transaction = this.db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const affected = new Set<ObjectIdentifier>();
		for (const patch of patches) {
			store.put(patch);
			affected.add(getOidRoot(patch.oid));
		}
		await new Promise<void>((resolve, reject) => {
			transaction.oncomplete = () => {
				resolve();
			};
			transaction.onerror = () => {
				reject();
			};
		});
		return Array.from(affected);
	};
}
