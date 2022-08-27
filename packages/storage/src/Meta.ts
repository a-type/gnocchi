import {
	AckMessage,
	applyPatch,
	DocumentBaseline,
	omit,
	ReplicaInfo,
	SERVER_REPLICA_ID,
	SyncMessage,
	SyncOperation,
	SyncResponseMessage,
	SyncStep2Message,
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

// local info types for the client
type LocalReplicaInfo = {
	type: 'localReplicaInfo';
	id: string;
	ackedLogicalTime: string | null;
};
type AckInfo = {
	type: 'ack';
	// null means no operations are acknowledged
	// by every peer yet.
	globalAckTimestamp: string | null;
};
type LocalHistoryItem = {
	operationId: string;
	timestamp: string;
};
type LocalHistory = {
	type: 'localHistory';
	items: LocalHistoryItem[];
};
type StoredBaseline = DocumentBaseline & {
	collection_documentId: string;
};

const globalIDB =
	typeof window !== 'undefined' ? window.indexedDB : (undefined as any);

export class Meta {
	private db: Promise<IDBDatabase>;
	// low value for testing
	private localHistoryLength = 10;
	private cachedLocalReplicaInfo: LocalReplicaInfo | undefined;

	constructor(private sync: Sync, indexedDB: IDBFactory = globalIDB) {
		this.db = this.openMetaDatabase(indexedDB);
	}

	get ready(): Promise<void> {
		return this.db.then();
	}

	private openMetaDatabase = (indexedDB: IDBFactory) => {
		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('meta', 1);
			request.onupgradeneeded = (event) => {
				const db = request.result;
				// version 1: operations list, baselines, and local info
				if (!event.oldVersion) {
					const opsStore = db.createObjectStore('operations', {
						keyPath: 'id',
					});
					const baselinesStore = db.createObjectStore('baselines', {
						keyPath: 'collection_documentId',
					});
					const infoStore = db.createObjectStore('info', { keyPath: 'type' });
					opsStore.createIndex('timestamp', 'timestamp');
					opsStore.createIndex('documentId_timestamp', 'documentId_timestamp');
					opsStore.createIndex('replicaId_timestamp', 'replicaId_timestamp');
					baselinesStore.createIndex('timestamp', 'timestamp');
				}
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

	/**
	 * Acks that we have seen a timestamp to the server
	 * and stores it as our local ackedLogicalTime if it's
	 * greater than our current ackedLogicalTime.
	 */
	ack = async (timestamp: string) => {
		const localReplicaInfo = await this.getLocalReplicaInfo();
		this.sync.send({
			type: 'ack',
			replicaId: localReplicaInfo.id,
			timestamp,
		});
		if (
			!localReplicaInfo.ackedLogicalTime ||
			timestamp > localReplicaInfo.ackedLogicalTime
		) {
			this.updateLocalReplicaInfo({ ackedLogicalTime: timestamp });
		}
	};

	async getLocalReplicaInfo(): Promise<LocalReplicaInfo> {
		if (this.cachedLocalReplicaInfo) {
			return this.cachedLocalReplicaInfo;
		}

		const db = await this.db;
		const transaction = db.transaction('info', 'readonly');
		const store = transaction.objectStore('info');

		const request = store.get('localReplicaInfo');
		const lookup = await storeRequestPromise(request);

		if (!lookup) {
			// create our own replica info now
			const replicaId = cuid();
			const replicaInfo: LocalReplicaInfo = {
				type: 'localReplicaInfo',
				id: replicaId,
				ackedLogicalTime: null,
			};
			const transaction = db.transaction('info', 'readwrite');
			const store = transaction.objectStore('info');
			const request = store.add(replicaInfo);
			await storeRequestPromise(request);
			this.cachedLocalReplicaInfo = replicaInfo;
			return replicaInfo;
		}

		this.cachedLocalReplicaInfo = lookup;
		return lookup;
	}

	updateLocalReplicaInfo = async (data: Partial<LocalReplicaInfo>) => {
		const localReplicaInfo = await this.getLocalReplicaInfo();
		Object.assign(localReplicaInfo, data);
		const db = await this.db;
		const transaction = db.transaction('info', 'readwrite');
		const store = transaction.objectStore('info');
		const request = store.put(localReplicaInfo);
		await storeRequestPromise(request);
		this.cachedLocalReplicaInfo = localReplicaInfo;
	};

	createOperation = async (
		init: Pick<SyncOperation, 'collection' | 'documentId' | 'patch'> & {
			timestamp?: string;
		},
	): Promise<SyncOperation> => {
		const localInfo = await this.getLocalReplicaInfo();
		return {
			timestamp: this.sync.time.now(),
			...init,
			replicaId: localInfo.id,
			id: cuid(),
		};
	};

	iterateOverAllOperationsForDocument = async (
		documentId: string,
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
		const index = store.index('documentId_timestamp');

		// we can get the whole range of operations for a document in order
		// by iterating over the index from (documentId{LOWER_BOUND_SEPARATOR} to documentId{UPPER_BOUND_SEPARATOR}).
		// because lexogrpahically these two end points are boundaries of the
		// range.
		const start =
			from || after
				? `${documentId}${COMPOUND_INDEX_SEPARATOR}${from || after}`
				: `${documentId}${COMPOUND_INDEX_LOWER_BOUND_SEPARATOR}`;
		const end = to
			? `${documentId}${COMPOUND_INDEX_SEPARATOR}${to}`
			: `${documentId}${COMPOUND_INDEX_UPPER_BOUND_SEPARATOR}`;
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
					assert(cursor.value.documentId === documentId);
					// and also assert we're moving in the right order
					assert(
						previousTimestamp === undefined ||
							cursor.value.timestamp > previousTimestamp,
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
		{ from, to }: { from?: string | null; to?: string | null },
	) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readonly');
		const store = transaction.objectStore('operations');
		const index = store.index('replicaId_timestamp');

		// similar start/end range semantics to iterateOverAllOperationsForDocument
		const start = from
			? `${replicaId}${COMPOUND_INDEX_SEPARATOR}${from}`
			: `${replicaId}${COMPOUND_INDEX_LOWER_BOUND_SEPARATOR}`;
		const end = to
			? `${replicaId}${COMPOUND_INDEX_SEPARATOR}${to}`
			: `${replicaId}${COMPOUND_INDEX_UPPER_BOUND_SEPARATOR}`;
		// range ends are open if a from/to was not specified
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

	getBaselinesForDocuments = async (docIds: string[]) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readonly');
		const store = transaction.objectStore('operations');
		const requests = docIds.map((docId) => {
			return store.get(docId);
		});
		return Promise.all(requests.map(storeRequestPromise));
	};

	private getOperationCompoundIndices = (operation: SyncOperation) => {
		return {
			documentId_timestamp: `${operation.documentId}${COMPOUND_INDEX_SEPARATOR}${operation.timestamp}`,
			replicaId_timestamp: `${operation.replicaId}${COMPOUND_INDEX_SEPARATOR}${operation.timestamp}`,
		};
	};

	private stripOperationCompoundIndices = (
		op: SyncOperation & {
			documentId_timestamp: string;
			replicaId_timestamp: string;
		},
	): SyncOperation => {
		return omit(op, ['documentId_timestamp', 'replicaId_timestamp']);
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

	insertLocalOperation = async (item: SyncOperation) => {
		this.insertOperation(item);
		return this.addLocalHistoryItem(item.id, item.timestamp);
	};

	/**
	 * inserts all operations. returns a list of affected document ids (and their collections)
	 * NOTE: operations added with this method are never added to local history!
	 */
	insertRemoteOperations = async (items: SyncOperation[]) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const affected: Record<string, { documentId: string; collection: string }> =
			{};
		for (const item of items) {
			store.put({
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

	private addLocalHistoryItem = async (
		operationId: string,
		timestamp: string,
	) => {
		// TODO: PERF: cache this in memory
		const db = await this.db;
		const transaction = db.transaction('info', 'readwrite');
		const store = transaction.objectStore('info');
		let history = await storeRequestPromise<LocalHistory>(
			store.get('localHistory'),
		);
		if (!history) {
			history = {
				type: 'localHistory',
				items: [],
			};
		}

		// TODO: PERF: find a better way to avoid duplicate items
		const existing = history.items.find(
			(item) => item.operationId === operationId,
		);
		if (existing) {
			return history.items[0].timestamp;
		}

		history.items.push({
			operationId,
			timestamp,
		});
		// drop old items
		if (history.items.length > this.localHistoryLength) {
			history.items.shift();
		}
		const oldestHistoryTimestamp = history.items[0].timestamp;
		await storeRequestPromise(store.put(history));
		return oldestHistoryTimestamp;
	};

	getBaseline = async (
		collection: string,
		documentId: string,
	): Promise<DocumentBaseline> => {
		const db = await this.db;
		const transaction = db.transaction('baselines', 'readonly');
		const store = transaction.objectStore('baselines');
		const request = store.get(
			`${collection}${COMPOUND_INDEX_SEPARATOR}${documentId}`,
		);
		const result = await storeRequestPromise<StoredBaseline>(request);
		if (!result) {
			return result;
		}
		return omit(result, ['collection_documentId']);
	};

	setBaseline = async <T>(
		collection: string,
		baseline: DocumentBaseline<T>,
	) => {
		const db = await this.db;
		const transaction = db.transaction('baselines', 'readwrite');
		const store = transaction.objectStore('baselines');
		const request = store.put({
			...baseline,
			collection_documentId: `${collection}${COMPOUND_INDEX_SEPARATOR}${baseline.documentId}`,
		});
		await storeRequestPromise(request);
	};

	getComputedView = async <T = any>(
		collection: string,
		documentId: string,
		upToTimestamp?: string,
	): Promise<T> => {
		// lookup baseline and get all operations
		const baseline = await this.getBaseline(collection, documentId);
		let computed: T | {} | undefined = baseline?.snapshot || {};
		await this.iterateOverAllOperationsForDocument(
			documentId,
			(op) => {
				computed = this.applyOperation(computed, op);
			},
			{
				after: baseline?.timestamp,
			},
		);

		// asserting T type - even if baseline is an empty object, applying
		// operations should conform it to the final shape.
		return computed as T;
	};

	getAckInfo = async (): Promise<AckInfo> => {
		const db = await this.db;
		const transaction = db.transaction('info', 'readonly');
		const store = transaction.objectStore('info');
		const request = store.get('ack');
		const result = await storeRequestPromise<AckInfo>(request);
		if (result) {
			return result;
		} else {
			return {
				globalAckTimestamp: null,
				type: 'ack',
			};
		}
	};

	setGlobalAck = async (ack: string) => {
		const ackInfo = await this.getAckInfo();
		const db = await this.db;
		const transaction = db.transaction('info', 'readwrite');
		const store = transaction.objectStore('info');
		const request = store.put({
			...ackInfo,
			globalAckTimestamp: ack,
		});
	};

	/**
	 * Pulls all local operations the server has not seen.
	 */
	getSync = async (): Promise<Pick<SyncMessage, 'timestamp' | 'replicaId'>> => {
		const localReplicaInfo = await this.getLocalReplicaInfo();

		return {
			timestamp: this.sync.time.now(),
			replicaId: localReplicaInfo.id,
		};
	};

	getSyncStep2 = async (
		provideChangesSince: SyncResponseMessage['provideChangesSince'],
	): Promise<Omit<SyncStep2Message, 'type'>> => {
		const localReplicaInfo = await this.getLocalReplicaInfo();
		// collect all of our operations that are newer than the server's last operation
		// if server replica isn't stored, we're syncing for the first time.
		const operations = await this.getAllOperationsFromReplica(
			localReplicaInfo.id,
			{
				from: provideChangesSince,
			},
		);
		// for now we just send every baseline for every
		// affected document... TODO: optimize this
		const affectedDocs = new Set(operations.map((op) => op.documentId));
		const baselines = await this.getBaselinesForDocuments(
			Array.from(affectedDocs),
		);

		return {
			timestamp: this.sync.time.now(),
			ops: operations,
			// don't send empty baselines
			baselines: baselines.filter(Boolean),
			replicaId: localReplicaInfo.id,
		};
	};

	private applyOperation = <T>(
		doc: T,
		operation: SyncOperation,
	): T | undefined => {
		return applyPatch(doc, operation.patch);
	};

	rebase = async (collection: string, documentId: string, upTo: string) => {
		let baseline = await this.getBaseline(collection, documentId);
		if (!baseline) {
			baseline = {
				documentId,
				snapshot: {},
				timestamp: upTo,
			};
		}
		console.debug(`rebase ${collection}/${documentId} up to ${upTo}`);
		console.debug(`baseline: ${JSON.stringify(baseline)}`);
		await this.iterateOverAllOperationsForDocument(
			documentId,
			(op) => {
				console.debug(`applying op ${JSON.stringify(op)}`);
				baseline.snapshot = this.applyOperation(baseline.snapshot, op);
			},
			{
				to: upTo,
			},
		);
		await this.setBaseline(collection, baseline);
		// separate iteration to ensure the above has completed before destructive
		// actions. TODO: use a transaction instead
		await this.iterateOverAllOperationsForDocument(
			documentId,
			(op, store) => {
				store.delete(op.id);
			},
			{
				to: upTo,
				mode: 'readwrite',
			},
		);

		console.log(
			'successfully rebased',
			collection,
			':',
			documentId,
			'up to',
			upTo,
		);
	};

	stats = async () => {
		const db = await this.db;
		// total number of operations
		const transaction = db.transaction(['operations', 'info'], 'readonly');
		const opsStore = transaction.objectStore('operations');
		const request = opsStore.count();
		const count = await storeRequestPromise<number>(request);

		const infoStore = transaction.objectStore('info');
		const localHistoryRequest = infoStore.get('localHistory');
		const history = await storeRequestPromise<LocalHistory>(
			localHistoryRequest,
		);

		return {
			operationCount: count,
			localHistoryLength: history?.items.length || 0,
		};
	};
}
