import {
	CollectionEvents,
	CollectionIndexFilter,
	StorageCollectionSchema,
} from '@aglio/storage-common';
import { EventSubscriber } from '../EventSubscriber.js';
import { LiveQuery } from './LiveQuery.js';

function orderedReplacer(_: any, v: any) {
	if (typeof v !== 'object' || v === null || Array.isArray(v)) {
		return v;
	}
	return Object.fromEntries(
		Object.entries(v).sort(([ka], [kb]) => (ka < kb ? -1 : ka > kb ? 1 : 0)),
	);
}
function hashFilter(filter: any) {
	return JSON.stringify(filter, orderedReplacer);
}

export class QueryCache<Collection extends StorageCollectionSchema<any, any>> {
	private queries: Map<string, LiveQuery<Collection, any>> = new Map();

	constructor(private events: EventSubscriber<CollectionEvents<Collection>>) {}

	getKey = (
		type: 'get' | 'findOne' | 'getAll',
		filter?: CollectionIndexFilter<Collection, any> | string,
	) => {
		return `${type}_${filter ? hashFilter(filter) : ''}`;
	};

	get = (
		key: string,
		exec: () => any,
		listen: (keyof CollectionEvents<Collection>)[],
	) => {
		let query = this.queries.get(key);
		if (!query) {
			query = new LiveQuery<Collection, any>(exec, this.events, listen, () => {
				this.dispose(key);
			});
			this.queries.set(key, query);
		}
		return query;
	};

	dispose = (key: string) => {
		this.queries.delete(key);
	};

	stats = () => {
		return {
			queryCount: this.queries.size,
		};
	};
}
