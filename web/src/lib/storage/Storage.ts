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
	CollectionIndex,
	CollectionIndexFilter,
} from './types';
import { EventsOf, EventSubscriber } from 'lib/EventSubscriber';
import { assert } from 'lib/assert';

function initializeDatabases<
	Schemas extends Record<string, StorageCollectionSchema<any, any, any>>,
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
		const unique = schema.unique?.includes(name);
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
			const unique = schema.unique?.includes(indexName);
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
	private _collections: Record<keyof Schemas, StorageCollection<any>> =
		{} as any;

	constructor(private collectionSchemas: Schemas) {
		const databases = initializeDatabases({
			collections: this.collectionSchemas,
		});
		for (const [name, database] of Object.entries(databases)) {
			this._collections[name as keyof Schemas] = new StorageCollection(
				database,
				this.collectionSchemas[name as keyof Schemas],
			);
		}
	}

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
}

export function storage<
	Schemas extends Record<string, StorageCollectionSchema<any, any, any>>,
>(collectionSchemas: Schemas) {
	return new Storage(collectionSchemas);
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

export class StorageCollection<
	Collection extends StorageCollectionSchema<any, any, any>,
> {
	private events: CollectionEvents<Collection> = new EventSubscriber();
	private liveObjectCache: Record<string, StorageDocument<Collection>> = {};
	constructor(
		private db: Promise<IDBDatabase>,
		private collection: Collection,
	) {}

	get name() {
		return this.collection.name;
	}

	get initialized(): Promise<void> {
		return this.db.then();
	}

	private readTransaction = async () => {
		const db = await this.db;
		const transaction = db.transaction('objects', 'readonly');
		const store = transaction.objectStore('objects');
		return store;
	};

	private readWriteTransaction = async () => {
		const db = await this.db;
		const transaction = db.transaction('objects', 'readwrite');
		const store = transaction.objectStore('objects');
		return store;
	};

	private getLiveObject = (record: StorageDocument<Collection>) => {
		if (!this.liveObjectCache[record.id]) {
			this.liveObjectCache[record.id] = makeLiveObject(record);
		}
		return this.liveObjectCache[record.id]!;
	};

	get = (id: string) => {
		return new LiveQuery(
			async () => {
				const store = await this.readTransaction();
				const request = store.get(id);
				const result = await storeRequestPromise(request);
				if (!result) return null;
				return this.getLiveObject(result);
			},
			this.events,
			['add', 'delete'],
		);
	};

	// TODO: use index filter param, ordering
	findOne = <Key extends CollectionIndex<Collection>>(
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
				const store = await this.readTransaction();
				const request = store.index(key).get(value as any);
				const raw = await storeRequestPromise(request);
				if (!raw) return null;
				return this.getLiveObject(raw);
			},
			this.events,
			['add', 'delete', 'update'],
		);
	};

	private getIndexedListRequest = (
		store: IDBObjectStore,
		index?: CollectionIndexFilter<Collection, any>,
	) => {
		if (!index) return store.openCursor();
		const indexName = index.where;
		// TODO: fix any typing? the value of the indexed property type
		// is too broad, it doesn't know we don't index booleans, etc.
		const indexValue = index.equals as any;
		return store.index(indexName).openCursor(indexValue);
	};
	getAll = <Index extends CollectionIndex<Collection>>(
		index?: CollectionIndexFilter<Collection, Index>,
	) => {
		return new LiveQuery<Collection, StorageDocument<Collection>[]>(
			async () => {
				const store = await this.readTransaction();
				const request = this.getIndexedListRequest(store, index);
				return new Promise((resolve, reject) => {
					const results: StorageDocument<Collection>[] = [];
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
		const store = await this.readWriteTransaction();
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
			setLiveObject(this.liveObjectCache[id], updatedWithComputed);
		}

		return this.getLiveObject(updatedWithComputed);
	};

	create = async (data: ShapeFromFields<Collection['schema']['fields']>) => {
		const store = await this.readWriteTransaction();
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

	upsert = async (
		data: ShapeFromFields<Collection['schema']['fields']> & { id: string },
	) => {
		const store = await this.readWriteTransaction();
		const existing = await storeRequestPromise(store.get(data.id));
		const obj = {
			...data,
			...this.computeProperties(data),
			id: existing?.id || cuid(),
		};
		const request = store.put(obj);

		await storeRequestPromise(request);

		this.events.emit('add', obj);

		return this.getLiveObject(obj);
	};

	delete = async (id: string) => {
		const store = await this.readWriteTransaction();
		const request = store.delete(id);

		const result = await storeRequestPromise(request);

		this.events.emit('delete', id);
		this.events.emit(`delete:${id}`);
		if (this.liveObjectCache[id]) {
			setLiveObject(this.liveObjectCache[id], null);
		}

		return result;
	};

	deleteAll = async (ids: string[]) => {
		const store = await this.readWriteTransaction();

		const promises = new Array<Promise<any>>();
		for (const id of ids) {
			const request = store.delete(id);
			promises.push(
				storeRequestPromise(request).then(() => {
					this.events.emit('delete', id);
					this.events.emit(`delete:${id}`);
					if (this.liveObjectCache[id]) {
						setLiveObject(this.liveObjectCache[id], null);
					}
				}),
			);
		}

		await Promise.all(promises);
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

export class LiveQuery<
	Collection extends StorageCollectionSchema<any, any, any>,
	T,
> {
	private _current: T | null = null;
	private _subscribers: Set<(value: T | null) => void> = new Set();
	resolved: Promise<T | null>;

	constructor(
		private exec: () => Promise<T>,
		private events: CollectionEvents<Collection>,
		listen: EventsOf<CollectionEvents<Collection>>[],
	) {
		this.resolved = this.update();
		for (const event of listen) {
			this.events.subscribe(event, () => {
				this.resolved = this.update();
			});
		}
	}

	get current() {
		return this._current;
	}

	private update = async () => {
		this._current = await this.exec();
		this._subscribers.forEach((subscriber) => subscriber(this._current));
		return this._current;
	};

	subscribe = (callback: (value: T | null) => void) => {
		this._subscribers.add(callback);
		return () => {
			this._subscribers.delete(callback);
		};
	};
}

const LIVE_OBJECT_SET = Symbol('@@live-object-set');
const LIVE_OBJECT_SUBSCRIBE = Symbol('@@live-object-subscribe');

type LiveObject = {
	[LIVE_OBJECT_SET]: (value: any) => void;
	[LIVE_OBJECT_SUBSCRIBE]: (callback: (value: any) => void) => () => void;
};

export function subscribe<T extends Record<string | symbol, any>>(
	obj: T,
	callback: (value: T | null) => void,
) {
	if (!obj[LIVE_OBJECT_SUBSCRIBE]) {
		throw new Error('Cannot subscribe to a non-live object: ' + obj);
	}
	return obj[LIVE_OBJECT_SUBSCRIBE](callback);
}

function setLiveObject(obj: any, value: any) {
	if (!obj[LIVE_OBJECT_SET]) {
		throw new Error('Cannot set a non-live object');
	}
	obj[LIVE_OBJECT_SET](value);
}

function makeLiveObject<T extends Record<string, any>>(source: T) {
	const ref = { current: source };
	function setSource(value: T) {
		ref.current = value;
	}
	const subscribers = new Set<(value: T) => void>();
	function subscribe(callback: (value: T) => void) {
		subscribers.add(callback);
		return () => {
			subscribers.delete(callback);
		};
	}
	return new Proxy(ref, {
		get: (target, key) => {
			if (key === LIVE_OBJECT_SET) {
				return setSource;
			}
			if (key === LIVE_OBJECT_SUBSCRIBE) {
				return subscribe;
			}
			return Reflect.get(target.current, key);
		},
		set: (target, key, value) => {
			throw new Error('Cannot set properties on a live object');
		},
	}) as unknown as T;
}
