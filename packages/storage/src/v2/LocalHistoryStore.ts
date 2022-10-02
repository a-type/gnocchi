import { storeRequestPromise } from '../idb.js';

type LocalHistoryItem = {
	operationId: string;
	timestamp: string;
};
type LocalHistory = {
	type: 'localHistory';
	items: LocalHistoryItem[];
};

export class LocalHistoryStore {
	localHistoryLength = 10;

	constructor(private readonly db: IDBDatabase) {}

	get = async (): Promise<LocalHistory> => {
		const db = this.db;
		const transaction = db.transaction('info', 'readonly');
		const store = transaction.objectStore('info');
		const request = store.get('localHistory');
		const result = await storeRequestPromise<LocalHistory>(request);
		if (result) {
			return result;
		} else {
			return {
				type: 'localHistory',
				items: [],
			};
		}
	};

	add = async (item: LocalHistoryItem) => {
		// TODO: PERF: cache this in memory
		const db = this.db;
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
			(item) => item.operationId === item.operationId,
		);
		if (existing) {
			return history.items[0].timestamp;
		}

		history.items.push({
			operationId: item.operationId,
			timestamp: item.timestamp,
		});
		// drop old items
		if (history.items.length > this.localHistoryLength) {
			history.items.shift();
		}
		const oldestHistoryTimestamp = history.items[0].timestamp;
		await storeRequestPromise(store.put(history));
		return oldestHistoryTimestamp;
	};
}
