import {
	applyPatch,
	DocumentBaseline,
	ReplicaInfo,
	SERVER_REPLICA_ID,
	SyncMessage,
	SyncOperation,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import cuid from 'cuid';
import { storeRequestPromise } from './idb.js';
import { Sync } from './Sync.js';

// arbitrary early ASCII character
const COMPOUND_INDEX_SEPARATOR = '#';
// 1 lower in ASCII table than the separator
const COMPOUND_INDEX_LOWER_BOUND_SEPARATOR = '"';
// 1 higher in ASCII table than the separator
const COMPOUND_INDEX_UPPER_BOUND_SEPARATOR = '$';

export class Meta {
	private db: Promise<IDBDatabase>;

	constructor(private sync: Sync) {
		this.db = this.openMetaDatabase();
	}

	get ready(): Promise<void> {
		return this.db.then();
	}

	private openMetaDatabase = () => {
		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('operationHistory', 1);
			request.onupgradeneeded = (event) => {
				const db = request.result;
				const opsStore = db.createObjectStore('operations', { keyPath: 'id' });
				const baselinesStore = db.createObjectStore('baselines', {
					keyPath: 'documentId',
				});
				const replicasStore = db.createObjectStore('replicas', {
					keyPath: 'replicaId',
				});

				opsStore.createIndex('timestamp', 'timestamp');
				opsStore.createIndex('documentId_timestamp', 'documentId_timestamp');
				opsStore.createIndex('replicaId_timestamp', 'replicaId_timestamp');
				replicasStore.createIndex('isLocal', 'isLocal');
			};
			request.onerror = () => {
				console.error('Error opening database', request.error);
				reject(request.error);
			};
			request.onsuccess = () => {
				resolve(request.result);
			};
		});
	};

	// TODO: cache this in memory
	async getLocalReplicaInfo(): Promise<ReplicaInfo> {
		const db = await this.db;
		const transaction = db.transaction('replicas', 'readonly');
		const store = transaction.objectStore('replicas');
		// find the replica which has isLocal=true
		const index = store.index('isLocal');
		const request = index.get(1);
		const lookup = await new Promise<ReplicaInfo | undefined>(
			(resolve, reject) => {
				request.onerror = () => {
					reject(request.error);
				};
				request.onsuccess = () => {
					resolve(request.result);
				};
			},
		);

		if (!lookup) {
			// create our own replica info now
			const replicaId = cuid();
			const replicaInfo: ReplicaInfo & { isLocal: 0 | 1 } = {
				replicaId,
				isLocal: 1,
				lastSeenLogicalTime: this.sync.time.now(),
				oldestOperationLogicalTime: this.sync.time.now(),
			};
			const transaction = db.transaction('replicas', 'readwrite');
			const store = transaction.objectStore('replicas');
			const request = store.add(replicaInfo);
			await storeRequestPromise(request);
			return replicaInfo;
		}

		return lookup;
	}

	async getServerReplicaInfo(): Promise<ReplicaInfo | null> {
		const db = await this.db;
		const transaction = db.transaction('replicas', 'readonly');
		const store = transaction.objectStore('replicas');
		return new Promise<ReplicaInfo | null>((resolve, reject) => {
			const request = store.get(SERVER_REPLICA_ID);
			request.onerror = () => {
				reject(request.error);
			};
			request.onsuccess = () => {
				resolve(request.result || null);
			};
		});
	}

	createOperation = async (
		init: Pick<SyncOperation, 'collection' | 'documentId' | 'patch'> & {
			timestamp?: string;
		},
	): Promise<SyncOperation> => {
		const localInfo = await this.getLocalReplicaInfo();
		return {
			timestamp: this.sync.time.now(),
			...init,
			replicaId: localInfo.replicaId,
			id: cuid(),
		};
	};

	iterateOverAllOperationsForDocument = async (
		documentId: string,
		iterator: (op: SyncOperation) => void,
	): Promise<void> => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readonly');
		const store = transaction.objectStore('operations');
		const index = store.index('documentId_timestamp');

		// we can get the whole range of operations for a document in order
		// by iterating over the index from (documentId{LOWER_BOUND_SEPARATOR} to documentId{UPPER_BOUND_SEPARATOR}).
		// because lexogrpahically these two end points are boundaries of the
		// range.
		const start = `${documentId}${COMPOUND_INDEX_LOWER_BOUND_SEPARATOR}`;
		const end = `${documentId}${COMPOUND_INDEX_UPPER_BOUND_SEPARATOR}`;
		const range = IDBKeyRange.bound(start, end, true, true);

		// iterate over operations in timestamp order from oldest to newest
		const request = index.openCursor(range, 'next');
		return new Promise<void>((resolve, reject) => {
			let previousTimestamp: string | undefined;
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					// debug assertions to make sure we're iterating only on operations
					// pertaining to this document. a failure means the index usage is wrong above.
					assert(cursor.value.documentId === documentId);
					// and also assert we're moving in the right order
					assert(
						previousTimestamp === undefined ||
							cursor.value.timestamp > previousTimestamp,
					);

					iterator(cursor.value);

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
		{ from, to }: { from?: string; to?: string },
	) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readonly');
		const store = transaction.objectStore('operations');
		const index = store.index('replicaId_timestamp');

		// similar start/end range semantics to iterateOverAllOperationsForDocument
		const start = from
			? `${replicaId}_${from}`
			: `${replicaId}${COMPOUND_INDEX_LOWER_BOUND_SEPARATOR}`;
		const end = to
			? `${replicaId}_${to}`
			: `${replicaId}${COMPOUND_INDEX_UPPER_BOUND_SEPARATOR}`;
		// range ends are open if a from/to was not specified
		const range = IDBKeyRange.bound(start, end, !from, !to);

		const request = index.openCursor(range, 'next');
		return new Promise<SyncOperation[]>((resolve, reject) => {
			const operations: SyncOperation[] = [];
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					operations.push(cursor.value);
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
			documentId_timestamp: `${operation.documentId}${COMPOUND_INDEX_SEPARATOR}${operation.timestamp}`,
			replicaId_timestamp: `${operation.replicaId}${COMPOUND_INDEX_SEPARATOR}${operation.timestamp}`,
		};
	};

	insertOperation = async (item: SyncOperation) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const request = store.add({
			...item,
			...this.getOperationCompoundIndices(item),
		});
		await storeRequestPromise(request);
		// TODO: update our replica info for the affected replica
	};

	/**
	 * inserts all operations. returns a list of affected document ids (and their collections)
	 */
	insertOperations = async (items: SyncOperation[]) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const affected: Record<string, { documentId: string; collection: string }> =
			{};
		for (const item of items) {
			store.add({
				...item,
				...this.getOperationCompoundIndices(item),
			});
			affected[item.documentId] = {
				documentId: item.documentId,
				collection: item.collection,
			};
		}
		await new Promise<void>((resolve, reject) => {
			transaction.oncomplete = () => {
				resolve();
			};
			transaction.onerror = () => {
				reject();
			};
		});
		return Object.values(affected);
	};

	getBaseline = async <T>(
		collection: string,
		documentId: string,
	): Promise<DocumentBaseline<T>> => {
		const db = await this.db;
		const transaction = db.transaction('baselines', 'readonly');
		const store = transaction.objectStore('baselines');
		const request = store.get(`${collection}/${documentId}`);
		const result = await storeRequestPromise<DocumentBaseline<T>>(request);
		return result;
	};

	getComputedView = async <T = any>(
		collection: string,
		documentId: string,
	): Promise<T> => {
		// lookup baseline and get all operations
		const baseline = await this.getBaseline<T>(collection, documentId);
		let computed: T | {} | undefined = baseline?.snapshot || {};
		await this.iterateOverAllOperationsForDocument(documentId, (op) => {
			computed = this.applyOperation(computed, op);
		});

		// asserting T type - even if baseline is an empty object, applying
		// operations should conform it to the final shape.
		return computed as T;
	};

	setReplica = async (replica: ReplicaInfo) => {
		const db = await this.db;
		const transaction = db.transaction('replicas', 'readwrite');
		const store = transaction.objectStore('replicas');
		const request = store.put(replica);
		return storeRequestPromise(request);
	};

	/**
	 * Pulls all local operations the server has not seen.
	 */
	getServerSyncInfo = async (): Promise<
		Pick<SyncMessage, 'ops' | 'replicaInfo' | 'timestamp'>
	> => {
		const db = await this.db;
		const localReplicaInfo = await this.getLocalReplicaInfo();

		// collect all of our operations that are newer than the server's last operation
		// if server replica isn't stored, we're syncing for the first time.
		const serverReplicaInfo = await this.getServerReplicaInfo();
		const syncFrom = serverReplicaInfo
			? serverReplicaInfo.lastSeenLogicalTime
			: undefined;
		const operations = await this.getAllOperationsFromReplica(
			localReplicaInfo.replicaId,
			{
				from: syncFrom,
			},
		);
		return {
			ops: operations,
			replicaInfo: localReplicaInfo,
			timestamp: this.sync.time.now(),
		};
	};

	private applyOperation = <T>(
		doc: T,
		operation: SyncOperation,
	): T | undefined => {
		return applyPatch(doc, operation.patch);
	};
}
