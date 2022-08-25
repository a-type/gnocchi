import { NaiveTimestampProvider } from '@aglio/storage-common';
import { IDBFactory } from 'fake-indexeddb';
import { Storage, collection, schema } from '../../src/index.js';

const todo = collection({
	name: 'todo',
	primaryKey: 'id',
	fields: {
		id: { type: 'string', indexed: true, unique: true },
		content: {
			type: 'string',
			indexed: false,
			unique: false,
		},
		done: {
			type: 'boolean',
		},
	},
	synthetics: {
		example: {
			type: '#string',
			compute: (doc) => doc.content,
			unique: false,
		},
	},
});

const testSchema = schema({
	version: 1,
	collections: {
		todo,
	},
});

export function createTestStorage() {
	const idb = new IDBFactory();
	const storage = new Storage({
		schema: testSchema,
		indexedDB: idb,
		syncOptions: {
			host: 'none',
			timestampProvider: new NaiveTimestampProvider(),
		},
	});
	return storage;
}
