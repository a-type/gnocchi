import {
	StorageNumberCompoundSchema,
	StorageCollectionSchema,
	StorageCompoundIndexSchema,
	StorageFieldSchema,
	StorageFieldsSchema,
	StorageNumberFieldSchema,
	StorageStringFieldSchema,
	StorageStringCompoundSchema,
	StorageCompoundIndices,
} from '@aglio/storage-common';

const globalIDB =
	typeof window !== 'undefined' ? window.indexedDB : (undefined as any);

export function initializeDatabases<
	Schemas extends Record<string, StorageCollectionSchema<any, any>>,
>(
	{ collections, version }: { collections: Schemas; version: number },
	indexedDB: IDBFactory = globalIDB,
) {
	// initialize collections as indexddb databases
	const keys = Object.keys(collections);
	console.log('Initializing database for:', keys);
	const database = new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open('collections', version);
		request.onupgradeneeded = (event) => {
			// TODO: migrations

			const db = request.result;
			for (const name of keys) {
				initializeDatabase(db, collections[name]);
			}
		};
		request.onsuccess = (event) => {
			resolve(request.result);
		};
		request.onerror = (event) => {
			console.error('Error opening database', request.error);
			reject(request.error);
		};
		request.onblocked = () => {
			// TODO:
			console.warn('Database is blocked');
		};
	});

	return database;
}

// determines if a field is indexed. also narrows the type to only indexable fields.
function isIndexedField(
	field: StorageFieldSchema,
): field is StorageStringFieldSchema | StorageNumberFieldSchema {
	return (
		field.type !== 'boolean' &&
		field.type !== 'array' &&
		field.type !== 'object' &&
		!!field.indexed
	);
}

function initializeDatabase(
	db: IDBDatabase,
	schema: StorageCollectionSchema<
		StorageFieldsSchema,
		StorageCompoundIndices<StorageFieldsSchema>
	>,
) {
	// create the object store
	const objectStore = db.createObjectStore(schema.name, {
		keyPath: schema.primaryKey,
		autoIncrement: false,
	});

	for (const [name, def] of Object.entries(schema.fields)) {
		// primary key is already taken care of.
		if (name === schema.primaryKey) continue;
		if (isIndexedField(def)) {
			const unique = def.unique;
			objectStore.createIndex(name, name, { unique });
		}
	}
	for (const [name, def] of Object.entries(schema.synthetics)) {
		const unique = def.unique;
		objectStore.createIndex(name, name, { unique });
	}
}
