import { useMemo, useRef, useSyncExternalStore } from 'react';
import { suspend } from 'suspend-react';
import {
	Storage,
	LiveQuery,
	subscribe,
	CollectionInMemoryFilters,
	LiveDocument,
} from '@aglio/storage';
import {
	CollectionIndexFilter,
	CollectionIndexName,
	StorageCollectionSchema,
	StorageDocument,
	StorageSchema,
} from '@aglio/storage-common';

type QueryHookResult<T> = T;

type CollectionHooks<
	Name extends string,
	Collection extends StorageCollectionSchema<any, any, any>,
> = {
	[key in Name as `use${Capitalize<Name>}`]: (
		id: string,
	) => QueryHookResult<LiveDocument<StorageDocument<Collection>>>;
} & {
	[key in Name as `useAll${Capitalize<Name>}`]: <
		IndexName extends CollectionIndexName<Collection>,
	>(config?: {
		index?: CollectionIndexFilter<Collection, IndexName>;
		filter?: CollectionInMemoryFilters<Collection>;
	}) => QueryHookResult<LiveDocument<StorageDocument<Collection>>[]>;
};

type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (
	k: infer U,
) => void
	? U
	: never;
type Flatten<T extends Record<string, any>> = T extends Record<string, infer V>
	? UnionToIntersection<V>
	: never;

type GeneratedHooks<
	Schema extends StorageSchema<{
		[k: string]: StorageCollectionSchema<any, any, any>;
	}>,
> = Flatten<{
	[CollectionName in Extract<
		keyof Schema['collections'],
		string
	>]: CollectionHooks<CollectionName, Schema['collections'][CollectionName]>;
}>;

function useLiveQuery<
	CollectionSchema extends StorageCollectionSchema<any, any, any>,
	T,
>(liveQuery: LiveQuery<CollectionSchema, T>) {
	suspend(() => liveQuery.resolved, [liveQuery.key]);
	return useSyncExternalStore(liveQuery.subscribe, () => liveQuery.current);
}

function capitalize<T extends string>(str: T) {
	return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

type CapitalizedCollectionName<
	Schema extends StorageSchema<{
		[k: string]: StorageCollectionSchema<any, any, any>;
	}>,
> = Capitalize<Extract<keyof Schema['collections'], string>>;

export function createHooks<
	Schema extends StorageSchema<{
		[k: string]: StorageCollectionSchema<any, any, any>;
	}>,
>(
	storage: Storage<Schema>,
): GeneratedHooks<Schema> & {
	useWatch<T>(liveObject: T): T;
} {
	function useWatch(liveObject: any) {
		return useSyncExternalStore(
			(handler) => subscribe(liveObject, handler),
			() => liveObject,
		);
	}

	const hooks: Record<string, any> = {
		useWatch,
	};

	for (const name of Object.keys(storage.collections)) {
		const collection = storage.collections[name];
		const getOneHookName = `use${capitalize(
			name,
		)}` as `use${CapitalizedCollectionName<Schema>}`;
		hooks[getOneHookName] = function useOne(id: string) {
			suspend(() => collection.initialized, [name]);
			const liveQuery = useMemo(() => {
				return collection.get(id);
			}, [id]);
			const data = useLiveQuery(liveQuery);

			return data;
		};

		const getAllHookName = `useAll${capitalize(
			name,
		)}` as `useAll${CapitalizedCollectionName<Schema>}`;
		hooks[getAllHookName] = function useAll(
			config: {
				index?: CollectionIndexFilter<any, any>;
				filter?: CollectionInMemoryFilters<any>;
			} = {},
		) {
			suspend(() => collection.initialized, [name]);
			// assumptions: this query getter is fast and returns the same
			// query identity for subsequent calls.
			const liveQuery = collection.getAll(config.index, config.filter);
			const data = useLiveQuery(liveQuery);
			return data;
		};
	}
	return hooks as GeneratedHooks<Schema> & {
		useWatch<T>(liveObject: T): T;
	};
}
