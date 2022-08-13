import { computeSynthetics } from './synthetics.js';
import { StorageCollectionSchema, StorageFieldSchema } from './types.js';

export function initializeDatabases<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
>({ collections }: { collections: Schemas }) {
	// initialize collections as indexddb databases
	const keys = Object.keys(collections);
	console.log('Initializing databases:', keys);
	const databases = keys.map((name) => {
		const { schema } = collections[name];
		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(name, schema.version);
			request.onupgradeneeded = async (event) => {
				const db = request.result;

				if (!event.oldVersion) {
					// if previous version doesn't exist, create it
					initializeDatabase(db, collections[name]);
				} else {
					// otherwise migrate data if needed
					await migrateDatabase(db, event.oldVersion, collections[name]);
				}
			};
			request.onerror = () => {
				console.error('Error opening database', name, request.error);
			};
			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onblocked = () => {
				// TODO:
			};
		});
	});

	const databasesMap = keys.reduce((acc, name, index) => {
		acc[name as keyof Schemas] = databases[index];
		return acc;
	}, {} as Record<keyof Schemas, Promise<IDBDatabase>>);

	return databasesMap;
}

function initializeDatabase(
	db: IDBDatabase,
	{ name, schema }: StorageCollectionSchema<any, any>,
) {
	// create the object store
	const objectStore = db.createObjectStore('objects', {
		keyPath: schema.primaryKey,
		autoIncrement: false,
	});

	for (const [name, def] of Object.entries(schema.fields)) {
		// primary key is already taken care of.
		if (name === schema.primaryKey) continue;

		const unique = (def as any).unique;
		objectStore.createIndex(name, name, { unique });
	}
}

async function migrateDatabase(
	db: IDBDatabase,
	oldVersion: number,
	{ schema, historicalSchemas }: StorageCollectionSchema<any, any>,
) {
	if (!historicalSchemas) {
		throw new Error('No historical schemas for migration');
	}
	// sanity
	const orderedByVersion = historicalSchemas.sort(
		(a, b) => a.version - b.version,
	);
	// find where we left off
	const startIndex = orderedByVersion.findIndex((s) => s.version > oldVersion);
	if (startIndex === -1) {
		throw new Error('No historical schemas for migration');
	}

	let endIndex = orderedByVersion.findIndex((s) => s.version > schema.version);
	if (endIndex === -1) {
		endIndex = orderedByVersion.length;
	}

	// migrate data
	for (let i = startIndex; i < endIndex; i++) {
		const historicalSchema = orderedByVersion[i];
		const { fields, synthetics, migrate } = historicalSchema;
		const objectStore = db
			.transaction('objects', 'readwrite')
			.objectStore('objects');

		// migrate data
		if (migrate) {
			await new Promise<void>((resolve, reject) => {
				// read all objects and run through migrate function
				const cursorReq = objectStore.openCursor();
				cursorReq.onsuccess = (event) => {
					const cursor = cursorReq.result;
					if (cursor) {
						const { value } = cursor;
						const migrated = migrate(value);
						// apply synthetics
						const synthetics = computeSynthetics(schema, migrated);
						cursor.update({ ...migrated, ...synthetics });
						cursor.continue();
					} else {
						// done
						resolve();
					}
				};
				cursorReq.onerror = () => {
					reject(cursorReq.error);
				};
			});
		}

		const newIndexNames = Object.keys(fields).concat(Object.keys(synthetics));

		// remove old indexes
		const indexesToAdd = newIndexNames.filter(
			(name) => !objectStore.indexNames.contains(name),
		);
		const indexesToRemove = Array.from(objectStore.indexNames).filter(
			(name) => !newIndexNames.includes(name),
		);

		for (const indexName of indexesToAdd) {
			const def = fields[indexName] || synthetics[indexName];
			if (!def) {
				throw new Error('Index not found: ' + indexName);
			}
			const unique = def.unique;
			objectStore.createIndex(indexName, indexName, { unique });
		}

		for (const indexName of indexesToRemove) {
			objectStore.deleteIndex(indexName);
		}
	}
}
