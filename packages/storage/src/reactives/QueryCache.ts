import {
	CollectionCompoundIndexFilter,
	CollectionEvents,
	CollectionIndexFilter,
	StorageCollectionSchema,
	StorageDocument,
} from '@aglio/storage-common';
import { EventSubscriber } from '../EventSubscriber.js';
import { CollectionInMemoryFilters } from '../StorageCollection.js';
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
function hashIndex(filter: any) {
	return JSON.stringify(filter, orderedReplacer);
}

export class QueryCache<
	Collection extends StorageCollectionSchema<any, any, any>,
> {
	private queries: Map<string, LiveQuery<Collection, any>> = new Map();

	constructor(private events: EventSubscriber<CollectionEvents<Collection>>) {}

	getKey = (
		type: 'get' | 'findOne' | 'getAll',
		index?:
			| CollectionIndexFilter<Collection, any>
			| string
			| CollectionCompoundIndexFilter<Collection, any>,
		filter?: CollectionInMemoryFilters<Collection>,
	) => {
		return `${type}_${index ? hashIndex(index) : ''}_${filter?.key || ''}`;
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
			query = new LiveQuery<Collection, T>(
				key,
				exec,
				this.events,
				listen,
				() => {
					this.dispose(key);
				},
			);
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
