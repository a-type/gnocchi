import { useMemo, useRef, useSyncExternalStore } from 'react';
import { suspend } from 'suspend-react';
import { LiveQuery } from './LiveQuery.js';
import { Storage } from './Storage.js';
import { subscribe } from './LiveObject.js';
import {
	CollectionIndex,
	CollectionIndexFilter,
	StorageCollectionSchema,
	StorageDocument,
} from './types.js';

type QueryHookResult<T> = {
	data: T | null;
	loading: boolean;
	error: Error | null;
};

type CollectionHooks<
	Name extends string,
	Schema extends StorageCollectionSchema<any, any>,
> = {
	[key in Name as `use${Capitalize<Name>}`]: (
		id: string,
	) => QueryHookResult<StorageDocument<Schema>>;
} & {
	[key in Name as `useAll${Capitalize<Name>}`]: <
		Index extends CollectionIndex<Schema>,
	>(
		index?: CollectionIndexFilter<Schema, Index>,
	) => QueryHookResult<StorageDocument<Schema>[]>;
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
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
> = Flatten<{
	[CollectionName in Extract<keyof Schemas, string>]: CollectionHooks<
		CollectionName,
		Schemas[CollectionName]
	>;
}>;

function useLiveQuery<
	CollectionSchema extends StorageCollectionSchema<any, any>,
	T,
>(liveQuery: LiveQuery<CollectionSchema, T>) {
	return useSyncExternalStore(liveQuery.subscribe, () => liveQuery.current);
}

function capitalize<T extends string>(str: T) {
	return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

type CapitalizedCollectionName<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
> = Capitalize<Extract<keyof Schemas, string>>;

export function createHooks<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
>(
	storage: Storage<Schemas>,
): GeneratedHooks<Schemas> & {
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
		)}` as `use${CapitalizedCollectionName<Schemas>}`;
		hooks[getOneHookName] = function useOne(id: string) {
			suspend(() => collection.initialized, [name]);
			const liveQuery = useMemo(() => {
				return collection.get(id);
			}, [id]);
			const data = useLiveQuery(liveQuery);

			return {
				data,
				// TODO:
				loading: false,
				error: null,
			};
		};

		const getAllHookName = `useAll${capitalize(
			name,
		)}` as `useAll${CapitalizedCollectionName<Schemas>}`;
		hooks[getAllHookName] = function useAll(
			index?: CollectionIndexFilter<any, any>,
		) {
			suspend(() => collection.initialized, [name]);
			// only rerender if filter changes
			// FIXME: make this better
			const filterRef = useRef(index);
			const notEqual =
				JSON.stringify(filterRef.current) !== JSON.stringify(index);
			if (notEqual) {
				filterRef.current = index;
			}
			const liveQuery = useMemo(() => {
				return collection.getAll(filterRef.current);
			}, [filterRef.current]);
			const data = useLiveQuery(liveQuery);
			return {
				data,
				// TODO:
				loading: false,
				error: null,
			};
		};
	}
	return hooks as GeneratedHooks<Schemas> & {
		useWatch<T>(liveObject: T): T;
	};
}
