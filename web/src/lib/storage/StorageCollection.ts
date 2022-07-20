import cuid from 'cuid';
import { assert } from 'lib/assert';
import { EventSubscriber } from 'lib/EventSubscriber';
import { makeLiveObject, setLiveObject } from './LiveObject';
import { LiveQuery } from './LiveQuery';
import { computeSynthetics } from './synthetics';
import {
	CollectionEvents,
	CollectionIndex,
	CollectionIndexFilter,
	GetSchemaProperty,
	ShapeFromFields,
	ShapeFromProperty,
	StorageCollectionSchema,
	StorageDocument,
	StorageFieldsSchema,
	StorageIndexablePropertyName,
	StoragePropertyName,
	StorageSyntheticsSchema,
} from './types';

export class StorageCollection<
	Collection extends StorageCollectionSchema<any, any, any>,
> {
	private events: CollectionEvents<Collection> = new EventSubscriber();
	private liveObjectCache: Record<
		string | number | symbol,
		StorageDocument<Collection>
	> = {};
	constructor(
		private db: Promise<IDBDatabase>,
		private collection: Collection,
	) {}

	get name() {
		return this.collection.name;
	}

	private get primaryKey() {
		return this.collection.schema.primaryKey;
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
		const id = record[this.primaryKey] as string;
		if (!this.liveObjectCache[id]) {
			this.liveObjectCache[id] = makeLiveObject(record);
		}
		return this.liveObjectCache[id]!;
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
		};
		const request = store.add(obj);

		await storeRequestPromise(request);

		this.events.emit('add', obj);

		return this.getLiveObject(obj);
	};

	upsert = async (data: ShapeFromFields<Collection['schema']['fields']>) => {
		const store = await this.readWriteTransaction();
		const obj = {
			...data,
			...this.computeProperties(data),
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

export function collection<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields>,
	Indexes extends StoragePropertyName<Fields, Computeds>[],
>(input: StorageCollectionSchema<Fields, Computeds, Indexes>) {
	return input;
}
