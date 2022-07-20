import { assert } from 'lib/assert';
import { initializeDatabases } from './databaseManagement';
import { StorageCollection } from './StorageCollection';
import { StorageCollectionSchema } from './types';

export class Storage<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
> {
	private _collections: Record<keyof Schemas, StorageCollection<any>> =
		{} as any;

	constructor(private collectionSchemas: Schemas) {
		const databases = initializeDatabases({
			collections: this.collectionSchemas,
		});
		for (const [name, database] of Object.entries(databases)) {
			this._collections[name as keyof Schemas] = new StorageCollection(
				database,
				this.collectionSchemas[name as keyof Schemas],
			);
		}
	}

	get<T extends keyof Schemas>(name: T): StorageCollection<Schemas[T]> {
		const collection = this._collections[name];
		assert(
			!!collection,
			'Sanity check: collection ' + collection + ' not found',
		);
		return collection;
	}

	get collections() {
		return this._collections;
	}
}

export function storage<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
>(collectionSchemas: Schemas) {
	return new Storage(collectionSchemas);
}
