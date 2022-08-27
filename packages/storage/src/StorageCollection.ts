import { EventSubscriber } from './EventSubscriber.js';
import { computeSynthetics } from './synthetics.js';
import {
	getSortedIndex,
	CollectionEvents,
	CollectionIndex,
	CollectionIndexFilter,
	CollectionSchemaComputedIndexes,
	isRangeIndexFilter,
	MatchCollectionIndexFilter,
	omit,
	RangeCollectionIndexFilter,
	ShapeFromFields,
	StorageCollectionSchema,
	StorageDocument,
	StorageDocumentWithComputedIndices,
	SyncPatch,
} from '@aglio/storage-common';
import { createPatch, SyncOperation } from '@aglio/storage-common';
import { Sync } from './Sync.js';
import { Meta } from './Meta.js';
import { cursorIterator, storeRequestPromise } from './idb.js';
import { QueryCache } from './reactives/QueryCache.js';
import { DocumentCache } from './reactives/DocumentCache.js';
import { getRaw, LiveDocument } from './reactives/LiveDocument.js';

export type CollectionInMemoryFilters<
	Collection extends StorageCollectionSchema<any, any>,
> = {
	/**
	 * This key must correspond to the filters being used.
	 * If you sort or filter in a different way but use the same key,
	 * the results will be wrong.
	 */
	key: string;
	filter?: (doc: StorageDocumentWithComputedIndices<Collection>) => boolean;
	sort?: (
		a: StorageDocumentWithComputedIndices<Collection>,
		b: StorageDocumentWithComputedIndices<Collection>,
	) => number;
};

export class StorageCollection<
	Collection extends StorageCollectionSchema<any, any>,
> {
	private events: EventSubscriber<CollectionEvents<Collection>> =
		new EventSubscriber();

	private queryCache = new QueryCache<Collection>(this.events);

	private applyLocalDocumentCacheOperations = async (
		ops: { documentId: string; patch: SyncPatch }[],
	) => {
		// TODO: apply multiple operations at once
		for (const { documentId, patch } of ops) {
			this.applyLocalOperation(
				await this.meta.createOperation({
					collection: this.name,
					documentId,
					patch,
				}),
			);
		}
	};
	private documentCache = new DocumentCache<Collection>(
		{
			applyOperations: this.applyLocalDocumentCacheOperations,
		},
		this.primaryKey,
	);

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

	private get compoundIndexKeys(): (keyof CollectionSchemaComputedIndexes<Collection>)[] {
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

	private getLiveDocument = (
		storedDoc: StorageDocumentWithComputedIndices<Collection>,
	) => {
		return this.documentCache.get(this.stripComputedIndices(storedDoc));
	};

	get = (id: string) => {
		return this.queryCache.get(
			this.queryCache.getKey('get', id),
			async () => {
				const store = await this.readTransaction();
				const request = store.get(id);
				const result = await storeRequestPromise(request);
				if (!result) return null;
				return this.getLiveDocument(result);
			},
			// is PUT relevant? do we support getting by id before the id
			// is created? probably should.
			['put', 'delete'],
		);
	};

	findOne = (
		filter: MatchCollectionIndexFilter<Collection, CollectionIndex<Collection>>,
	) => {
		return this.queryCache.get(
			this.queryCache.getKey('findOne', filter),
			async () => {
				const store = await this.readTransaction();
				const request = this.getIndexedListRequest(store, filter);
				let result: StorageDocumentWithComputedIndices<Collection> | undefined =
					undefined;
				await cursorIterator<StorageDocumentWithComputedIndices<Collection>>(
					request,
					(doc) => {
						if (doc) {
							result = doc;
							return false;
						}
						return true;
					},
				);
				if (!result) return null;
				return this.getLiveDocument(result);
			},
			['delete', 'put'],
		);
	};

	private rangeIndexToIdbKeyBound = (
		filter: RangeCollectionIndexFilter<Collection, CollectionIndex<Collection>>,
	) => {
		const lower = filter.gte || filter.gt;
		const upper = filter.lte || filter.lt;
		if (!lower) {
			return IDBKeyRange.upperBound(upper, !!filter.lt);
		} else if (!upper) {
			return IDBKeyRange.lowerBound(lower, !!filter.gt);
		} else {
			return IDBKeyRange.bound(lower, upper, !!filter.gt, !!filter.lt);
		}
	};

	private matchIndexToIdbKeyRange = (
		filter: MatchCollectionIndexFilter<Collection, CollectionIndex<Collection>>,
	) => {
		return IDBKeyRange.only(filter.equals as string | number);
	};

	private getIndexedListRequest = (
		store: IDBObjectStore,
		index?: CollectionIndexFilter<Collection, CollectionIndex<Collection>>,
	) => {
		if (!index) return store.openCursor();
		const indexName = index.where;
		const range = isRangeIndexFilter(index)
			? this.rangeIndexToIdbKeyBound(index)
			: this.matchIndexToIdbKeyRange(index);
		return store
			.index(indexName)
			.openCursor(range, index.order === 'desc' ? 'prev' : 'next');
	};
	getAll = <Index extends CollectionIndex<Collection>>(
		index?: CollectionIndexFilter<Collection, Index>,
		/**
		 * The secondary filtering allows in-memory filtering
		 * which is applied while the cursor is being iterated,
		 * which may be more efficient than filtering afterward.
		 */
		filters?: CollectionInMemoryFilters<Collection>,
	) => {
		const filter = filters?.filter;
		const sort = filters?.sort;
		return this.queryCache.get(
			this.queryCache.getKey('getAll', index, filters),
			async () => {
				const store = await this.readTransaction();
				const request = this.getIndexedListRequest(store, index);
				const results: StorageDocument<Collection>[] = [];
				await cursorIterator<StorageDocumentWithComputedIndices<Collection>>(
					request,
					(item) => {
						// skip empty docs
						if (!item) return true;

						// if no filter or filter matches, add to results
						if (!filter || filter(item)) {
							// sort the insertion if a sort is provided
							if (sort) {
								// find the index to insert the item using binary search
								const index = getSortedIndex(results, item, sort);
								results.splice(index, 0, item);
							} else {
								// otherwise just push to end
								results.push(item);
							}
						}

						// always keep going
						return true;
					},
				);
				return results.map((raw) => this.getLiveDocument(raw));
			},
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
			omit(from, this.compoundIndexKeys),
			omit(to, this.compoundIndexKeys),
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

		const rawCurrent = getRaw(current) as StorageDocument<Collection>;

		const updated = {
			...rawCurrent,
			...data,
		};

		const op = await this.meta.createOperation({
			collection: this.name,
			documentId: id,
			patch: this.createDiffPatch(rawCurrent, updated),
		});
		const final = await this.applyLocalOperation(op);

		return final!;
	};

	create = async (data: ShapeFromFields<Collection['fields']>) => {
		const op = await this.meta.createOperation({
			collection: this.name,
			documentId: data[this.primaryKey] as string,
			patch: this.createDiffPatch({}, data),
		});
		const final = await this.applyLocalOperation(op);

		// non-null assertion - we know it's not deleted if we just created it,
		// right?
		return final!;
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

	private stripComputedIndices = (
		doc: StorageDocumentWithComputedIndices<Collection>,
	): StorageDocument<Collection> => {
		return omit(doc, this.compoundIndexKeys) as any;
	};

	/** Sync Methods */

	private applyLocalOperation = async (operation: SyncOperation) => {
		// optimistic application
		const oldestHistoryTimestamp = await this.meta.insertLocalOperation(
			operation,
		);
		// TODO: should local ops be acked?
		await this.meta.ack(operation.timestamp);
		const result = this.recomputeDocument(operation.documentId);

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
			oldestHistoryTimestamp,
		});

		return result;
	};

	applyRemoteOperation = async (operation: SyncOperation) => {
		// to apply an operation we have to first insert it in the operation
		// history, then lookup and reapply all operations for that document
		// to the baseline.

		await this.meta.insertOperation(operation);
		await this.meta.ack(operation.timestamp);
		return this.recomputeDocument(operation.documentId);
	};

	recomputeDocument = async (
		id: string,
	): Promise<StorageDocument<Collection> | undefined> => {
		const updatedView = await this.meta.getComputedView(this.name, id);

		// undefined means the document was deleted
		if (updatedView === undefined) {
			const store = await this.readWriteTransaction();
			const request = store.delete(id);
			await storeRequestPromise(request);

			// emit events for this change
			this.events.emit('delete', id);
			this.events.emit(`delete:${id}`);

			this.documentCache.assign(id, null);

			return undefined;
		} else {
			// write the new view to the document
			const store = await this.readWriteTransaction();
			// apply computed indices to the document before
			// storing
			const updatedWithComputed = {
				...updatedView,
				...this.computeProperties(updatedView),
				[this.primaryKey]: id,
			};
			const request = store.put(updatedWithComputed);
			await storeRequestPromise(request);

			this.documentCache.assign(id, updatedView);

			this.events.emit('put', updatedView);
			this.events.emit(`put:${id}`, updatedView);

			return updatedView;
		}
	};

	rebaseDocument = async (id: string, upTo: string) => {
		const squashed = await this.meta.rebase(this.name, id, upTo);
	};

	stats = () => {
		return {
			caches: {
				...this.documentCache.stats(),
				...this.queryCache.stats(),
			},
		};
	};
}
