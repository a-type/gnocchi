import { hashObject } from '@aglio/storage-common';
import { Query } from './Query.js';

export class QueryStore {
	private cache = new Map<string, Query<any>>();

	constructor(private db: IDBDatabase) {}

	private getStore = (collection: string, write?: boolean) => {
		return this.db
			.transaction(collection, write ? 'readwrite' : 'readonly')
			.objectStore(collection);
	};

	get = (config: {
		collection: string;
		range: IDBKeyRange;
		index?: string;
		direction?: IDBCursorDirection;
		limit?: number;
		write?: boolean;
	}) => {
		const { collection, range, index, direction, limit, write } = config;
		const key = hashObject(config);
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}
		const store = this.getStore(collection, write);
		const source = index ? store.index(index) : store;
		const request = source.openCursor(range, direction);
		const run = () =>
			new Promise((resolve, reject) => {
				const result: any[] = [];
				request.onsuccess = () => {
					const cursor = request.result;
					if (cursor) {
						result.push(cursor.value);
						if (limit && result.length >= limit) {
							resolve(result);
						} else {
							cursor.continue();
						}
					} else {
						resolve(result);
					}
				};
				request.onerror = () => reject(request.error);
			});
		return new Query(
			run,
			(query) => {
				if (this.cache.has(key)) {
					console.warn(
						'Query already exists in cache for key',
						key,
						', this is not an error but suggests your code is creating multiple queries of the same type in the same frame and subscribing to them, and will produce less efficient memory usage.',
					);
				}
				this.cache.set(key, query);
			},
			() => {
				this.cache.delete(key);
			},
		);
	};
}
