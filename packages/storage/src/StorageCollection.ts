import { EventSubscriber } from './EventSubscriber.js';
import { makeLiveObject, setLiveObject } from './LiveObject.js';
import { LiveQuery } from './LiveQuery.js';
import { computeSynthetics } from './synthetics.js';
import {
	CollectionEvents,
	CollectionIndex,
	CollectionIndexFilter,
	omit,
	ShapeFromFields,
	StorageCollectionSchema,
	StorageDocument,
	SyncPatch,
} from '@aglio/storage-common';
import { createPatch, SyncOperation } from '@aglio/storage-common';
import { Sync } from './Sync.js';
import { Meta } from './Meta.js';
import { storeRequestPromise } from './idb.js';

export class StorageCollection<
	Collection extends StorageCollectionSchema<any, any>,
> {
	private events: EventSubscriber<CollectionEvents<Collection>> =
		new EventSubscriber();
	private liveObjectCache: Record<
		string | number | symbol,
		StorageDocument<Collection>
	> = {};

	constructor(
		private db: Promise<IDBDatabase>,
		private collection: Collection,
		private sync: Sync,
		private meta: Meta,
	) {}

	get name() {
		return this.collection.name;
	}

	private get primaryKey() {
		return this.collection.primaryKey;
	}

	private get syntheticKeys() {
		return Object.keys(this.collection.synthetics);
	}

	get initialized(): Promise<void> {
		return Promise.all([this.db, this.meta.ready]).then();
	}

	private readTransaction = async () => {
		const db = await this.db;
		const transaction = db.transaction(this.name, 'readonly');
		const store = transaction.objectStore(this.name);
		return store;
	};

	private readWriteTransaction = async () => {
		const db = await this.db;
		const transaction = db.transaction(this.name, 'readwrite');
		const store = transaction.objectStore(this.name);
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
			// is PUT relevant? do we support getting by id before the id
			// is created? probably should.
			['put', 'delete'],
		);
	};

	// TODO: ordering
	findOne = (
		filter: CollectionIndexFilter<Collection, CollectionIndex<Collection>>,
	) => {
		return new LiveQuery(
			async () => {
				const store = await this.readTransaction();
				const request = store.index(filter.where).get(filter.equals as any);
				const raw = await storeRequestPromise(request);
				if (!raw) return null;
				return this.getLiveObject(raw);
			},
			this.events,
			['delete', 'put'],
		);
	};

	private getIndexedListRequest = (
		store: IDBObjectStore,
		index?: CollectionIndexFilter<Collection, CollectionIndex<Collection>>,
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
			['delete', 'put'],
		);
	};

	/**
	 * Diffs the two versions of the document, removes synthetics, and returns a patch.
	 */
	private createDiffPatch = (
		from: Partial<StorageDocument<Collection>>,
		to: StorageDocument<Collection>,
	): SyncPatch => {
		return createPatch(
			omit(from, this.syntheticKeys),
			omit(to, this.syntheticKeys),
		);
	};

	update = async (
		id: string,
		data: Partial<ShapeFromFields<Collection['fields']>>,
	) => {
		const current = await this.get(id).resolved;
		if (!current) {
			throw new Error(`No document with id ${id}`);
		}

		const updated = {
			...current,
			...data,
		};

		const op = await this.meta.createOperation({
			collection: this.name,
			documentId: id,
			patch: this.createDiffPatch(current, updated),
		});
		const final = await this.applyLocalOperation(op);

		return final;
	};

	create = async (data: ShapeFromFields<Collection['fields']>) => {
		const op = await this.meta.createOperation({
			collection: this.name,
			documentId: data[this.primaryKey] as string,
			patch: this.createDiffPatch({}, data),
		});
		const final = await this.applyLocalOperation(op);

		return this.getLiveObject(final);
	};

	upsert = async (data: ShapeFromFields<Collection['fields']>) => {
		const id = data[this.primaryKey] as string;
		const current = await this.get(id).resolved;
		if (current) {
			return this.update(id, data);
		}
		return this.create(data);
	};

	delete = async (id: string) => {
		const op = await this.meta.createOperation({
			collection: this.name,
			documentId: id,
			patch: 'DELETE',
		});
		await this.applyLocalOperation(op);
	};

	deleteAll = async (ids: string[]) => {
		return Promise.all(ids.map((id) => this.delete(id)));
	};

	private computeProperties = (
		fields: ShapeFromFields<Collection['fields']>,
	) => {
		return computeSynthetics(this.collection, fields);
	};

	/** Sync Methods */

	private applyLocalOperation = async (operation: SyncOperation) => {
		// optimistic application
		const result = await this.applyOperation(operation);
		// sync to network
		this.sync.send({
			type: 'op',
			op: {
				collection: operation.collection,
				documentId: operation.documentId,
				id: operation.id,
				patch: operation.patch,
				replicaId: operation.replicaId,
				timestamp: operation.timestamp,
			},
		});

		return result;
	};

	applyOperation = async (operation: SyncOperation) => {
		// to apply an operation we have to first insert it in the operation
		// history, then lookup and reapply all operations for that document
		// to the baseline.

		await this.meta.insertOperation(operation);
		await this.meta.ack(operation.timestamp);
		return this.recomputeDocument(operation.documentId);
	};

	recomputeDocument = async (id: string) => {
		const updatedView = await this.meta.getComputedView(this.name, id);

		// undefined means the document was deleted
		if (updatedView === undefined) {
			const store = await this.readWriteTransaction();
			const request = store.delete(id);
			await storeRequestPromise(request);

			// emit events for this change
			this.events.emit('delete', id);
			this.events.emit(`delete:${id}`);

			if (this.liveObjectCache[id]) {
				setLiveObject(this.liveObjectCache[id], null);
			}

			return undefined;
		} else {
			// write the new view to the document
			const store = await this.readWriteTransaction();
			const updatedWithComputed = {
				...updatedView,
				...this.computeProperties(updatedView),
				[this.primaryKey]: id,
			};
			const request = store.put(updatedWithComputed);
			await storeRequestPromise(request);

			if (this.liveObjectCache[id]) {
				setLiveObject(this.liveObjectCache[id], updatedWithComputed);
			}

			this.events.emit('put', updatedWithComputed);
			this.events.emit(`put:${id}`, updatedWithComputed);

			return updatedWithComputed;
		}
	};
}
