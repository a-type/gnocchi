import { Migration, StorageSchema } from '@aglio/storage-common';
import { Sync } from '../Sync.js';
import { Metadata, openMetadataDatabase } from './Metadata.js';
import { QueryMaker } from './QueryMaker.js';
import { QueryStore } from './QueryStore.js';
import { PresenceManager } from './PresenceManager.js';
import { openDocumentDatabase } from './openDocumentDatabase.js';
import { DocumentCreator } from './DocumentCreator.js';
import { EntityStore } from './EntityStore.js';
import { storeRequestPromise } from '../idb.js';
import { SyncHarness } from './SyncHarness.js';

export class Storage<Schema extends StorageSchema<any>> {
	private entities = new EntityStore(this.documentDb, this.meta, this.sync);
	private syncHarness = new SyncHarness({
		sync: this.sync,
		meta: this.meta,
		entities: this.entities,
		initialPresence: {},
	});
	private queryStore = new QueryStore(this.documentDb, this.entities);
	queryMaker = new QueryMaker<Schema>(this.queryStore, this.schema);
	presence = new PresenceManager(this.sync, this.meta);
	documentCreator = new DocumentCreator<Schema>(
		this.meta,
		this.schema,
		this.entities,
	);

	constructor(
		private meta: Metadata,
		private schema: Schema,
		private documentDb: IDBDatabase,
		public sync: Sync,
	) {}

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

export async function openStorage<Schema extends StorageSchema<any>>({
	schema,
	migrations,
	sync,
	indexedDb = window.indexedDB,
}: {
	schema: Schema;
	migrations: Migration[];
	sync: Sync;
	indexedDb?: IDBFactory;
}) {
	const metaDb = await openMetadataDatabase(indexedDb);
	const meta = new Metadata(metaDb, sync, schema);

	const documentDb = await openDocumentDatabase({
		schema,
		meta,
		migrations,
		indexedDB: indexedDb,
	});

	return new Storage<Schema>(meta, schema, documentDb, sync);
}
