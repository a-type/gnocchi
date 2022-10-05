import {
	DocumentBaseline,
	getOidRange,
	ObjectIdentifier,
} from '@aglio/storage-common';
import { storeRequestPromise } from '../idb.js';

export class BaselinesStore {
	constructor(private readonly db: IDBDatabase) {}

	getAllForDocument = async (oid: ObjectIdentifier) => {
		const db = this.db;
		const transaction = db.transaction('baselines', 'readonly');
		const store = transaction.objectStore('baselines');
		const [start, end] = getOidRange(oid);
		const request = store.getAll(IDBKeyRange.bound(start, end, true, true));
		const results = await storeRequestPromise<DocumentBaseline[]>(request);
		return results;
	};

	getAllForMultipleDocuments = async (docOids: string[]) => {
		return (await Promise.all(docOids.map(this.getAllForDocument))).flat();
	};

	set = async <T>(baseline: DocumentBaseline<T>) => {
		const db = this.db;
		const transaction = db.transaction('baselines', 'readwrite');
		const store = transaction.objectStore('baselines');
		const request = store.put(baseline);
		await storeRequestPromise(request);
	};
}
