import { SyncOperation } from '@aglio/storage-common';

export class Meta {
	private db: Promise<IDBDatabase>;

	constructor() {
		this.db = this.openMetaDatabase();
	}

	private openMetaDatabase = () => {
		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open('operationHistory', 1);
			request.onupgradeneeded = (event) => {
				const db = request.result;
				const opsStore = db.createObjectStore('operations', { keyPath: 'id' });
				const baselinesStore = db.createObjectStore('baselines', {
					keyPath: 'id',
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

	getAllOperationsFor = (documentId: string): Promise<SyncOperation[]> => {};

	getEarliestOperations = (count: number): Promise<SyncOperation[]> => {};

	getOperationsAfter = (timestamp: string): Promise<SyncOperation[]> => {};

	insertOperation = (item: SyncOperation) => {};

	getBaseline = (
		collection: string,
		documentId: string,
	): Promise<Baseline> => {};

	getComputedView = async <T = any>(
		collection: string,
		documentId: string,
	): Promise<T> => {
		// lookup baseline and get all operations
		const [baseline, operations] = await Promise.all([
			this.getBaseline(collection, documentId),
			this.getAllOperationsFor(documentId),
		]);
		// apply all operations to baseline
		const computed = operations.reduce((acc, op) => {
			return this.applyOperation(acc, op);
		}, baseline);

		return computed;
	};

	private applyOperation = <T>(doc: T, operation: SyncOperation): T => {};
}
