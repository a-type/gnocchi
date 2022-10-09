import {
	Migration,
	SchemaCollectionName,
	StorageSchema,
} from '@aglio/storage-common';
import { Sync } from './Sync.js';
import { Metadata, openMetadataDatabase } from './Metadata.js';
import { QueryMaker } from './QueryMaker.js';
import { QueryStore } from './QueryStore.js';
import { PresenceManager } from './PresenceManager.js';
import { openDocumentDatabase } from './openDocumentDatabase.js';
import { DocumentManager } from './DocumentManager.js';
import { EntityStore } from './EntityStore.js';
import { storeRequestPromise } from './idb.js';
import { SyncHarness } from './SyncHarness.js';
import type { Presence } from '../index.js';

export class Storage<Schema extends StorageSchema<any>> {
	private entities = new EntityStore(
		this.documentDb,
		this.schema,
		this.meta,
		this.sync,
	);
	private syncHarness;
	private queryStore = new QueryStore(this.documentDb, this.entities);
	queryMaker = new QueryMaker<Schema>(this.queryStore, this.schema);
	documentManager = new DocumentManager<Schema>(
		this.meta,
		this.schema,
		this.entities,
	);
	readonly presence = new PresenceManager(this.sync, this.meta);

	readonly collectionNames: SchemaCollectionName<Schema>[];

	constructor(
		private meta: Metadata,
		private schema: Schema,
		private documentDb: IDBDatabase,
		public sync: Sync,
		initialPresence: Presence,
	) {
		this.collectionNames = Object.keys(
			schema.collections,
		) as SchemaCollectionName<Schema>[];
		this.syncHarness = new SyncHarness({
			sync: this.sync,
			meta: this.meta,
			entities: this.entities,
			initialPresence,
		});
	}

	create: this['documentManager']['create'] = async (...args) => {
		return this.documentManager.create(...args);
	};

	upsert: this['documentManager']['upsert'] = async (...args) => {
		return this.documentManager.upsert(...args);
	};

	delete: this['documentManager']['delete'] = async (...args) => {
		return this.documentManager.delete(...args);
	};

	get: this['queryMaker']['get'] = (...args) => {
		return this.queryMaker.get(...args);
	};

	findOne: this['queryMaker']['findOne'] = (...args) => {
		return this.queryMaker.findOne(...args);
	};

	findAll: this['queryMaker']['findAll'] = (...args) => {
		return this.queryMaker.findAll(...args);
	};

	stats = async () => {
		const collectionNames = Object.keys(this.schema.collections);
		const collectionStats = await Promise.all(
			collectionNames.map(async (collection) => {
				const tx = this.documentDb.transaction(collection, 'readonly');
				const store = tx.objectStore(collection);
				const countReq = store.count();
				const count = await storeRequestPromise<number>(countReq);
				return { collection, count };
			}),
		);
		return collectionNames.reduce((acc, collection) => {
			const stat = collectionStats.find((s) => s.collection === collection);
			if (stat) {
				acc[collection] = stat.count;
			}
			return acc;
		}, {} as Record<string, number>);
	};
}

export interface StorageInitOptions<Schema extends StorageSchema<any>> {
	schema: Schema;
	migrations: Migration[];
	sync: Sync;
	indexedDb?: IDBFactory;
	initialPresence: Presence;
}

/**
 * Since storage initialization is async, this class wraps the core
 * Storage creation promise and exposes some metadata which can
 * be useful immediately.
 */
export class StorageDescriptor<Schema extends StorageSchema<any>> {
	private readonly _readyPromise: Promise<Storage<Schema>>;
	// assertions because these are defined by plucking them from
	// Promise initializer
	private resolveReady!: (storage: Storage<Schema>) => void;
	private rejectReady!: (err: Error) => void;
	private _resolvedValue: Storage<Schema> | undefined;
	private _initializing = false;

	constructor(private readonly init: StorageInitOptions<Schema>) {
		this._readyPromise = new Promise((resolve, reject) => {
			this.resolveReady = resolve;
			this.rejectReady = reject;
		});
	}

	private initialize = async (init: StorageInitOptions<Schema>) => {
		if (this._initializing) {
			return this._readyPromise;
		}
		this._initializing = true;
		try {
			const metaDb = await openMetadataDatabase(init.indexedDb);
			const meta = new Metadata(metaDb, init.sync, init.schema);

			const documentDb = await openDocumentDatabase({
				schema: init.schema,
				meta,
				migrations: init.migrations,
				indexedDB: init.indexedDb,
			});

			const storage = new Storage<Schema>(
				meta,
				init.schema,
				documentDb,
				init.sync,
				init.initialPresence,
			);
			this.resolveReady(storage);
			this._resolvedValue = storage;
			return storage;
		} catch (err) {
			this.rejectReady(err as Error);
			throw err;
		} finally {
			this._initializing = false;
		}
	};

	get current() {
		// exposing an immediate value if already resolved lets us
		// skip the promise microtask when accessing this externally if
		// the initialization has been completed.
		return this._resolvedValue;
	}

	get readyPromise() {
		return this._readyPromise;
	}

	get schema() {
		return this.init.schema;
	}

	open = () => this.initialize(this.init);
}
