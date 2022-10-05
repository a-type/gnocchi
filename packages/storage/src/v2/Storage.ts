import { Migration, StorageSchema } from '@aglio/storage-common';
import { Sync } from '../Sync.js';
import { Metadata, openMetadataDatabase } from './Metadata.js';
import { QueryMaker } from './QueryMaker.js';
import { QueryStore } from './QueryStore.js';
import { PresenceManager } from './PresenceManager.js';
import { openDocumentDatabase } from './openDocumentDatabase.js';
import { DocumentCreator } from './DocumentCreator.js';
import { EntityStore } from './EntityStore.js';

export class Storage<Schema extends StorageSchema<any>> {
	private entities = new EntityStore(this.documentDb, this.meta, this.sync);
	private queryStore = new QueryStore(this.documentDb, this.entities);
	queryMaker = new QueryMaker(this.queryStore, this.schema);
	presence = new PresenceManager(this.sync, this.meta);
	documentCreator = new DocumentCreator(this.meta, this.schema, this.entities);

	constructor(
		private meta: Metadata,
		private schema: Schema,
		private documentDb: IDBDatabase,
		public sync: Sync,
	) {}
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
