import {
	createCompoundIndexValue,
	createLowerBoundIndexValue,
	createUpperBoundIndexValue,
	getOidRange,
	getOidRoot,
	ObjectIdentifier,
	Operation,
	OperationPatch,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';

export type ClientPatch = Operation & {
	replicaId: string;
};

export type StoredPatch = ClientPatch & {
	oid_timestamp: string;
	replicaId_timestamp: string;
	documentOid_timestamp: string;
};

export class PatchesStore {
	constructor(private readonly db: IDBDatabase) {}

	/**
	 * Iterates over every patch for the root and every sub-object
	 * of a given document. Optionally limit by timestamp.
	 */
	iterateOverAllPatchesForDocument = async (
		oid: ObjectIdentifier,
		iterator: (patch: StoredPatch, store: IDBObjectStore) => void,
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
		const index = store.index('documentOid_timestamp');

		const startTimestamp = from || after;
		const start = startTimestamp
			? createCompoundIndexValue(oid, startTimestamp)
			: createLowerBoundIndexValue(oid);
		const end = to
			? createCompoundIndexValue(oid, to)
			: createUpperBoundIndexValue(oid);

		const range = IDBKeyRange.bound(start, end, !!after, false);

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

	iterateOverAllPatchesForEntity = async (
		oid: ObjectIdentifier,
		iterator: (patch: StoredPatch, store: IDBObjectStore) => void,
		{
			to,
			mode,
		}: {
			to?: string;
			mode?: 'readwrite' | 'readonly';
		},
	): Promise<void> => {
		const transaction = this.db.transaction('patches', mode);
		const store = transaction.objectStore('patches');

		const start = createLowerBoundIndexValue(oid);
		const end = to
			? createCompoundIndexValue(oid, to)
			: createUpperBoundIndexValue(oid);

		const range = IDBKeyRange.bound(start, end, false, false);

		const request = store.openCursor(range, 'next');
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
			after,
		}: {
			before?: string | null;
			after?: string | null;
		},
	): Promise<void> => {
		const transaction = this.db.transaction('patches', 'readonly');
		const store = transaction.objectStore('patches');
		const index = store.index('replicaId_timestamp');

		const start = after
			? createCompoundIndexValue(replicaId, after)
			: createLowerBoundIndexValue(replicaId);
		const end = before
			? createCompoundIndexValue(replicaId, before)
			: createUpperBoundIndexValue(replicaId);

		const range = IDBKeyRange.bound(start, end, !!after, true);

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
			documentOid_timestamp: createCompoundIndexValue(
				getOidRoot(patch.oid),
				patch.timestamp,
			) as string,
		};
	};

	private insertPatches = async (
		patches: StoredPatch[],
	): Promise<ObjectIdentifier[]> => {
		const transaction = this.db.transaction('patches', 'readwrite');
		const store = transaction.objectStore('patches');
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
