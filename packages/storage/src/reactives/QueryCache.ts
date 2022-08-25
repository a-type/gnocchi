import {
	CollectionEvents,
	CollectionIndexFilter,
	StorageCollectionSchema,
	StorageDocument,
} from '@aglio/storage-common';
import { EventSubscriber } from '../EventSubscriber.js';
import { LiveDocument } from './LiveDocument.js';
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

	get = <
		T extends
			| null
			| LiveDocument<StorageDocument<Collection>>
			| LiveDocument<StorageDocument<Collection>>[],
	>(
		key: string,
		exec: () => Promise<T>,
		listen: (keyof CollectionEvents<Collection>)[],
	) => {
		let query = this.queries.get(key) as LiveQuery<Collection, T> | undefined;
		if (!query) {
			query = new LiveQuery<Collection, T>(exec, this.events, listen, () => {
				this.dispose(key);
			});
			this.queries.set(key, query);
		}
		return query!;
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
