import { Migration, StorageSchema } from '@aglio/storage-common';
import { Sync } from '../Sync.js';
import { Metadata, openMetadataDatabase } from './Metadata.js';
import { QueryMaker } from './QueryMaker.js';
import { QueryStore } from './QueryStore.js';
import { PresenceManager } from './PresenceManager.js';
import { openDocumentDatabase } from './openDocumentDatabase.js';

export class Storage<Schema extends StorageSchema<any>> {
	queryStore = new QueryStore(this.documentDb);
	queryMaker = new QueryMaker(this.queryStore, this.schema);
	presence = new PresenceManager(this.sync, this.meta);

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
	indexedDb,
}: {
	schema: Schema;
	migrations: Migration[];
	sync: Sync;
	indexedDb?: IDBFactory;
}) {
	const metaDb = await openMetadataDatabase(indexedDB);
	const meta = new Metadata(metaDb, sync, schema);

	const documentDb = await openDocumentDatabase({
		schema,
		meta,
		migrations,
		indexedDB,
	});

	return new Storage<Schema>(meta, schema, documentDb, sync);
}
