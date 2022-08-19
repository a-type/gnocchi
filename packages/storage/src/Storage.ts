import { assert } from '@aglio/tools';
import { initializeDatabases } from './databaseManagement.js';
import { StorageCollection } from './StorageCollection.js';
import { LocalSync, Sync } from './Sync.js';
import { StorageCollectionSchema } from './types.js';

export interface StorageOptions<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
> {
	schemas: Schemas;
	sync?: Sync;
}

export class Storage<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
> {
	// TODO: mapped type so collection identities are preserved
	private _collections: Record<keyof Schemas, StorageCollection<any>> =
		{} as any;
	private collectionSchemas: Schemas;
	private sync: Sync;
	private meta: Meta;

	constructor(options: StorageOptions<Schemas>) {
		this.collectionSchemas = options.schemas;
		this.sync = options.sync || new LocalSync();

		// centralized storage for all stored operations
		this.meta = new Meta();

		const databases = initializeDatabases({
			collections: this.collectionSchemas,
		});
		this.beginSync();
		for (const [name, database] of Object.entries(databases)) {
			this._collections[name as keyof Schemas] = new StorageCollection(
				database,
				this.collectionSchemas[name as keyof Schemas],
				this.sync,
				this.meta,
			);
		}
	}

	private beginSync = async () => {
		//
	};

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
>(options: StorageOptions<Schemas>) {
	return new Storage(options);
}
