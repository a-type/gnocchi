import cuid from 'cuid';
import {
	GetSchemaProperty,
	ShapeFromFields,
	ShapeFromProperty,
	StorageCollectionSchema,
	StorageComputedSchema,
	StorageSyntheticsSchema,
	StorageDocument,
	StorageFieldsSchema,
	StoragePropertyName,
	StorageSchema,
} from './types';
import { Cell } from '@starbeam/core';
import { EventsOf, EventSubscriber } from 'lib/EventSubscriber';

export async function createStorage<
	Schemas extends Record<string, StorageCollectionSchema<any, any, any>>,
>({ collections }: { collections: Schemas }) {
	// initialize collections as indexddb databases
	const databases = await Promise.all(
		Object.values(collections).map(async (collection) => {
			const { name, schema } = collection;
			return new Promise<[string, IDBDatabase]>((resolve, reject) => {
				const request = indexedDB.open(name, schema.version);
				request.onupgradeneeded = async (event) => {
					const db = request.result;

					if (!event.oldVersion) {
						// if previous version doesn't exist, create it
						initializeDatabase(db, collection);
					} else {
						// otherwise migrate data if needed
						await migrateDatabase(db, event.oldVersion, collection);
					}
				};
				request.onerror = () => {
					console.error('Error opening database', name, request.error);
				};
				request.onsuccess = () => {
					resolve([name, request.result]);
				};
				request.onblocked = () => {
					// TODO:
				};
			});
		}),
	);

	const databasesMap = databases.reduce((acc, [name, db]) => {
		acc[name as keyof Schemas] = db;
		return acc;
	}, {} as Record<keyof Schemas, IDBDatabase>);

	return new Storage<Schemas>(databasesMap);
}

function initializeDatabase(
	db: IDBDatabase,
	{ name, schema }: StorageCollectionSchema<any, any, any>,
) {
	// create the object store
	const objectStore = db.createObjectStore('objects', {
		keyPath: 'id',
		autoIncrement: false,
	});

	for (const name of schema.indexes) {
		const def = schema.fields[name] || schema.synthetics[name];
		if (!def) {
			throw new Error('Index not found: ' + name);
		}
		const unique = schema.unique.includes(name);
		objectStore.createIndex(name, name, { unique });
	}
}

async function migrateDatabase(
	db: IDBDatabase,
	oldVersion: number,
	{ schema, historicalSchemas }: StorageCollectionSchema<any, any, any>,
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
		const indexesToRemove = [...objectStore.indexNames].filter(
			(name) => !newIndexNames.includes(name),
		);

		for (const indexName of indexesToAdd) {
			const def = fields[indexName] || synthetics[indexName];
			if (!def) {
				throw new Error('Index not found: ' + indexName);
			}
			const unique = schema.unique.includes(indexName);
			objectStore.createIndex(indexName, indexName, { unique });
		}

		for (const indexName of indexesToRemove) {
			objectStore.deleteIndex(indexName);
		}
	}
}

export class Storage<
	Schemas extends Record<string, StorageCollectionSchema<any, any, any>>,
> {
	// initialized in constructor
	private collections: Record<keyof Schemas, StorageCollection<any>> =
		{} as any;

	constructor(databases: Record<keyof Schemas, IDBDatabase>) {
		for (const [name, database] of Object.entries(databases)) {
			this.collections[name as keyof Schemas] = new StorageCollection(
				database as IDBDatabase,
				this.collections[name] as any,
			);
		}
	}

	get<T extends keyof Schemas>(collection: T): StorageCollection<Schemas[T]> {
		return this.collections[collection];
	}
}

type CollectionEvents<
	Collection extends StorageCollectionSchema<any, any, any>,
> = EventSubscriber<{
	add: (value: StorageDocument<Collection>) => void;
	update: (value: StorageDocument<Collection>) => void;
	delete: (id: string) => void;
	[key: `update:${string}`]: (value: StorageDocument<Collection>) => void;
	[key: `delete:${string}`]: () => void;
}>;

class StorageCollection<
	Collection extends StorageCollectionSchema<any, any, any>,
> {
	private events: CollectionEvents<Collection> = new EventSubscriber();
	private liveObjectCache: Record<
		string,
		LiveObject<Collection, StorageDocument<Collection>>
	> = {};
	constructor(private db: IDBDatabase, private collection: Collection) {}

	get name() {
		return this.collection.name;
	}

	private readTransaction = () => {
		const transaction = this.db.transaction([this.name]);
		const store = transaction.objectStore('objects');
		return store;
	};

	private readWriteTransaction = () => {
		const transaction = this.db.transaction([this.name], 'readwrite');
		const store = transaction.objectStore('objects');
		return store;
	};

	private getLiveObject = (record: StorageDocument<Collection>) => {
		if (!this.liveObjectCache[record.id]) {
			const liveObject = new LiveObject<
				Collection,
				StorageDocument<Collection>
			>(record);
			this.liveObjectCache[record.id] = liveObject;
		}
		return this.liveObjectCache[record.id]!;
	};

	get = async (id: string) => {
		return new LiveQuery(
			async () => {
				const store = this.readTransaction();
				const request = store.get(id);
				const result = await storeRequestPromise(request);
				return this.getLiveObject(result);
			},
			this.events,
			['add', 'delete'],
		);
	};

	findOne = async <Key extends Collection['schema']['indexes'][number]>(
		key: Key,
		value: ShapeFromProperty<
			GetSchemaProperty<
				Collection['schema']['fields'],
				Collection['schema']['synthetics'],
				Key
			>
		>,
	) => {
		return new LiveQuery(
			async () => {
				const store = this.readTransaction();
				const request = store.index(key).get(value as any);
				const raw = await storeRequestPromise(request);
				return this.getLiveObject(raw);
			},
			this.events,
			['add', 'delete', 'update'],
		);
	};

	getAll = () => {
		return new LiveQuery<
			Collection,
			LiveObject<Collection, StorageDocument<Collection>>[]
		>(
			() => {
				const store = this.readTransaction();
				const request = store.openCursor();
				return new Promise((resolve, reject) => {
					const results: LiveObject<Collection, StorageDocument<Collection>>[] =
						[];
					request.onsuccess = (event) => {
						const cursor = request.result;
						if (cursor) {
							results.push(this.getLiveObject(cursor.value));
							cursor.continue();
						} else {
							resolve(results);
						}
					};
					request.onerror = () => {
						reject(request.error);
					};
				});
			},
			this.events,
			['add', 'delete', 'update'],
		);
	};

	update = async (id: string, data: Partial<StorageDocument<Collection>>) => {
		const store = this.readWriteTransaction();
		const getRequest = store.get(id);
		const existing: StorageDocument<Collection> = await new Promise(
			(resolve, reject) => {
				getRequest.onsuccess = () => {
					const { result } = getRequest;
					if (result) {
						resolve(result);
					} else {
						reject(new Error('Document not found'));
					}
				};
				getRequest.onerror = () => {
					reject(getRequest.error);
				};
			},
		);
		const updated = { ...existing, ...data };
		const updatedWithComputed = {
			...updated,
			...this.computeProperties(updated),
			id,
		};
		const request = store.put(updatedWithComputed);

		await storeRequestPromise(request);

		// issue update events and set on liveobject if it exists.
		this.events.emit('update', updatedWithComputed);
		this.events.emit(`update:${id}`, updatedWithComputed);
		if (this.liveObjectCache[id]) {
			this.liveObjectCache[id][LIVE_OBJECT_SET](updatedWithComputed);
		}

		return this.getLiveObject(updatedWithComputed);
	};

	create = async (data: ShapeFromFields<Collection['schema']['fields']>) => {
		const store = this.readWriteTransaction();
		const obj = {
			...data,
			...this.computeProperties(data),
			id: cuid(),
		};
		const request = store.add(obj);

		await storeRequestPromise(request);

		this.events.emit('add', obj);

		return this.getLiveObject(obj);
	};

	delete = async (id: string) => {
		const store = this.readWriteTransaction();
		const request = store.delete(id);

		const result = await storeRequestPromise(request);

		this.events.emit('delete', id);
		this.events.emit(`delete:${id}`);
		if (this.liveObjectCache[id]) {
			this.liveObjectCache[id][LIVE_OBJECT_SET](null);
		}

		return result;
	};

	private computeProperties = (
		fields: ShapeFromFields<Collection['schema']['fields']>,
	) => {
		return computeSynthetics(this.collection.schema, fields);
	};
}

function storeRequestPromise<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onerror = () => {
			reject(request.error);
		};
	});
}

function computeSynthetics(schema: StorageSchema<any, any, any>, obj: any) {
	const result: Record<string, any> = {};
	for (const [name, property] of Object.entries(schema.synthetics)) {
		result[name] = (property as StorageComputedSchema<any>).compute(obj);
	}
	return result;
}

export function collection<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields>,
	Indexes extends StoragePropertyName<Fields, Computeds>[],
>(input: StorageCollectionSchema<Fields, Computeds, Indexes>) {
	return input;
}

class LiveQuery<Collection extends StorageCollectionSchema<any, any, any>, T> {
	private _current: T | null = null;
	private _subscribers: Set<(value: T | null) => void> = new Set();

	constructor(
		private exec: () => Promise<T>,
		private events: CollectionEvents<Collection>,
		listen: EventsOf<CollectionEvents<Collection>>[],
	) {
		this.update();
		for (const event of listen) {
			this.events.subscribe(event, () => {
				this.update();
			});
		}
	}

	get current() {
		return this._current;
	}

	private update = async () => {
		this._current = await this.exec();
		this._subscribers.forEach((subscriber) => subscriber(this._current));
	};

	subscribe = (callback: (value: T | null) => void) => {
		this._subscribers.add(callback);
		return () => {
			this._subscribers.delete(callback);
		};
	};
}

const LIVE_OBJECT_SET = Symbol('@@live-object-set');
class LiveObject<Collection extends StorageCollectionSchema<any, any, any>, T> {
	private _current: T | null = null;
	private _subscribers: Set<(value: T | null) => void> = new Set();

	constructor(initial: T | null) {
		this._current = initial;
	}

	get current() {
		return this._current;
	}

	[LIVE_OBJECT_SET] = async (value: T | null) => {
		this._current = value;
		this._subscribers.forEach((subscriber) => subscriber(this._current));
	};

	subscribe = (callback: (value: T | null) => void) => {
		this._subscribers.add(callback);
		return () => {
			this._subscribers.delete(callback);
		};
	};
}
