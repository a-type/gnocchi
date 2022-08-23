import {
	ServerMessage,
	StorageSchema,
	SyncResponseMessage,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import { initializeDatabases } from './databaseManagement.js';
import { Meta } from './Meta.js';
import { StorageCollection } from './StorageCollection.js';
import { HybridSync, HybridSyncOptions } from './Sync.js';
import { StorageCollectionSchema } from '@aglio/storage-common';

export interface StorageOptions<
	Schema extends StorageSchema<{
		[key: string]: StorageCollectionSchema<any, any>;
	}>,
> {
	schema: Schema;
	syncOptions: HybridSyncOptions;
}

type SchemaToCollections<
	Schema extends StorageSchema<{
		[key: string]: StorageCollectionSchema<any, any>;
	}>,
> = {
	[key in keyof Schema['collections']]: StorageCollection<
		Schema['collections'][key]
	>;
};

export class Storage<
	Schema extends StorageSchema<{
		[key: string]: StorageCollectionSchema<any, any>;
	}>,
> {
	// TODO: mapped type so collection identities are preserved
	private _collections: SchemaToCollections<Schema> = {} as any;
	private schema: Schema;
	private _sync: HybridSync;
	private meta: Meta;

	constructor(options: StorageOptions<Schema>) {
		this.schema = options.schema;
		this._sync = new HybridSync(options.syncOptions);

		this._sync.subscribeToNetworkChange(this.handleOnlineChange);
		this._sync.subscribe(this.handleSyncMessage);

		// centralized storage for all stored operations
		this.meta = new Meta(this._sync);

		const database = initializeDatabases(this.schema);
		for (const [name, collection] of Object.entries(this.schema.collections)) {
			this._collections[name as keyof Schema['collections']] =
				new StorageCollection<
					Schema['collections'][keyof Schema['collections']]
				>(
					database,
					collection as Schema['collections'][keyof Schema['collections']],
					this._sync,
					this.meta,
				);
		}
	}

	get sync() {
		return this._sync;
	}

	get<T extends keyof Schema['collections']>(
		name: T,
	): StorageCollection<Schema['collections'][T]> {
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
		// store the global ack info
		await this.meta.setGlobalAck(message.globalAckTimestamp);

		// we need to add all operations to the operation history
		// and then recompute views of each affected document
		const affectedDocuments = await this.meta.insertOperations(message.ops);
		// refresh all those documents
		for (const doc of affectedDocuments) {
			this.get(doc.collection).recomputeDocument(doc.documentId);
		}

		// respond to the server
		const sync2 = await this.meta.getSyncStep2(message.provideChangesSince);
		this.sync.send({
			type: 'sync-step2',
			...sync2,
		});
	};

	private handleOnlineChange = async (online: boolean) => {
		if (!online) return;
		const sync = await this.meta.getSync();
		this.sync.send({
			type: 'sync',
			...sync,
			schemaVersion: this.schema.version,
		});
	};
}

export function storage<
	Schema extends StorageSchema<{
		[k: string]: StorageCollectionSchema<any, any>;
	}>,
>(options: StorageOptions<Schema>) {
	return new Storage(options);
}
