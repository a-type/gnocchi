import {
	HybridLogicalClockTimestampProvider,
	ServerMessage,
	SyncResponseMessage,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import { initializeDatabases } from './databaseManagement.js';
import { Meta } from './Meta.js';
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
		this.sync =
			options.sync || new LocalSync(new HybridLogicalClockTimestampProvider());

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

	private handleSyncMessage = (message: ServerMessage) => {
		switch (message.type) {
			case 'op-re':
				this.get(message.op.collection).applyOperation(message.op);
				break;
			case 'sync-resp':
				this.handleSyncResponse(message);
				break;
		}
	};

	private handleSyncResponse = async (message: SyncResponseMessage) => {
		// update our replica info
		for (const replica of message.peers) {
			this.meta.setReplica(replica);
		}
		// we need to add all operations to the operation history
		// and then recompute views of each affected document
		const affectedDocuments = await this.meta.insertOperations(message.ops);
		// refresh all those documents
		for (const doc of affectedDocuments) {
			this.get(doc.collection).recomputeDocument(doc.documentId);
		}
	};
}

export function storage<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
>(options: StorageOptions<Schemas>) {
	return new Storage(options);
}
