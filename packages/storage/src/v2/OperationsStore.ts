import {
	createCompoundIndexValue,
	createLowerBoundIndexValue,
	createUpperBoundIndexValue,
	ObjectIdentifier,
	omit,
	SyncOperation,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import { storeRequestPromise } from '../idb.js';

export class OperationsStore {
	constructor(private readonly db: IDBDatabase) {}

	iterateOverAllOperationsForDocument = async (
		documentOid: ObjectIdentifier,
		iterator: (op: SyncOperation, store: IDBObjectStore) => void,
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
		const db = await this.db;
		const transaction = db.transaction('operations', mode);
		const store = transaction.objectStore('operations');
		const index = store.index('rootOid_timestamp');

		// we can get the whole range of operations for a document in order
		// by iterating over the index from (documentId{LOWER_BOUND_SEPARATOR} to documentId{UPPER_BOUND_SEPARATOR}).
		// because lexogrpahically these two end points are boundaries of the
		// range.
		const startValue = from || after;
		const start = startValue
			? createCompoundIndexValue(documentOid, startValue)
			: createLowerBoundIndexValue(documentOid);
		const end = to
			? createCompoundIndexValue(documentOid, to)
			: createUpperBoundIndexValue(documentOid);
		const range = IDBKeyRange.bound(start, end, !from, !to);

		// iterate over operations in timestamp order from oldest to newest
		const request = index.openCursor(range, 'next');
		return new Promise<void>((resolve, reject) => {
			let previousTimestamp: string | undefined;
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					// debug assertions to make sure we're iterating only on operations
					// pertaining to this document. a failure means the index usage is wrong above.
					assert(cursor.value.rootOid === documentOid);
					// and also assert we're moving in the right order
					assert(
						previousTimestamp === undefined ||
							cursor.value.timestamp > previousTimestamp,
						`Operation ${JSON.stringify(
							cursor.value,
						)} is not after ${previousTimestamp}`,
					);

					iterator(this.stripOperationCompoundIndices(cursor.value), store);

					previousTimestamp = cursor.value.timestamp;

					cursor.continue();
				} else {
					resolve();
				}
			};
			request.onerror = () => {
				console.error('Error iterating over operations', request.error);
				reject();
			};
		});
	};

	getAllOperationsFromReplica = async (
		replicaId: string,
		{
			from,
			to,
			before,
			after,
		}: {
			from?: string | null;
			to?: string | null;
			before?: string | null;
			after?: string | null;
		},
	) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readonly');
		const store = transaction.objectStore('operations');
		const index = store.index('replicaId_timestamp');

		// similar start/end range semantics to iterateOverAllOperationsForDocument
		const initiator = from || after;
		const start = initiator
			? createCompoundIndexValue(replicaId, initiator)
			: createLowerBoundIndexValue(replicaId);
		const terminator = before || to;
		const end = terminator
			? createCompoundIndexValue(replicaId, terminator)
			: createUpperBoundIndexValue(replicaId);
		// range ends are open if a from/to was not specified. before/after are exclusive.
		const range = IDBKeyRange.bound(start, end, !from, !to);

		const request = index.openCursor(range, 'next');
		return new Promise<SyncOperation[]>((resolve, reject) => {
			const operations: SyncOperation[] = [];
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					operations.push(this.stripOperationCompoundIndices(cursor.value));
					cursor.continue();
				} else {
					resolve(operations);
				}
			};
			request.onerror = () => {
				console.error('Error getting operations', request.error);
				reject();
			};
		});
	};

	private getOperationCompoundIndices = (operation: SyncOperation) => {
		return {
			rootOid_timestamp: createCompoundIndexValue(
				operation.rootOid,
				operation.timestamp,
			),
			replicaId_timestamp: createCompoundIndexValue(
				operation.replicaId,
				operation.timestamp,
			),
		};
	};

	private stripOperationCompoundIndices = (
		op: SyncOperation & {
			rootOid_timestamp: string;
			replicaId_timestamp: string;
		},
	): SyncOperation => {
		return omit(op, ['rootOid_timestamp', 'replicaId_timestamp']);
	};

	insertOperation = async (item: SyncOperation) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const request = store.put({
			...item,
			...this.getOperationCompoundIndices(item),
		});
		await storeRequestPromise(request);
	};

	/**
	 * inserts all operations. returns a list of affected document oids
	 * NOTE: operations added with this method are never added to local history!
	 */
	insertOperations = async (items: SyncOperation[]) => {
		const db = this.db;
		const transaction = db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const affected = new Set<ObjectIdentifier>();
		for (const item of items) {
			store.put({
				...item,
				...this.getOperationCompoundIndices(item),
			});
			affected.add(item.rootOid);
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
