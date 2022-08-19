import {
	applyPatch,
	DocumentBaseline,
	ReplicaInfo,
	SyncOperation,
} from '@aglio/storage-common';
import { storeRequestPromise } from './idb.js';

export class Meta {
	private db: Promise<IDBDatabase>;

	constructor() {
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

	iterateOverAllOperationsFor = async (
		documentId: string,
		iterator: (op: SyncOperation) => void,
	): Promise<void> => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readonly');
		const store = transaction.objectStore('operations');
		const index = store.index('timestamp');
		// iterate over operations in timestamp order from oldest to newest
		const request = index.openCursor(null, 'next');
		return new Promise<void>((resolve, reject) => {
			request.onsuccess = (event) => {
				const cursor = request.result;
				if (cursor) {
					iterator(cursor.value);
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

	insertOperation = async (item: SyncOperation) => {
		const db = await this.db;
		const transaction = db.transaction('operations', 'readwrite');
		const store = transaction.objectStore('operations');
		const request = store.add(item);
		return storeRequestPromise(request);
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
			store.add(item);
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
		await this.iterateOverAllOperationsFor(documentId, (op) => {
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

	private applyOperation = <T>(
		doc: T,
		operation: SyncOperation,
	): T | undefined => {
		return applyPatch(doc, operation.patch);
	};
}
