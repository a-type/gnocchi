import {
	assignOid,
	decomposeOid,
	getOid,
	getRoots,
	ObjectIdentifier,
	Operation,
	OperationPatch,
	StorageCollectionSchema,
	StorageSchema,
} from '@aglio/storage-common';
import { Sync } from './Sync.js';
import { EntityBase, ObjectEntity, updateEntity } from './Entity.js';
import { storeRequestPromise } from './idb.js';
import { Metadata } from './Metadata.js';
import { computeCompoundIndices, computeSynthetics } from './indexes.js';

export class EntityStore {
	private cache = new Map<string, EntityBase<any>>();

	constructor(
		private readonly db: IDBDatabase,
		private readonly schema: StorageSchema<any>,
		public readonly meta: Metadata,
		private readonly sync: Sync,
	) {}

	onSubscribed = (self: EntityBase<any>) => {
		this.cache.set(self.oid, self);
	};
	onAllUnsubscribed = (self: EntityBase<any>) => {
		this.cache.delete(self.oid);
	};

	get = (initial: any) => {
		const oid = getOid(initial);
		const existing = this.cache.get(oid);
		if (existing) {
			return existing;
		}

		const { collection } = decomposeOid(oid);
		this.stripIndexes(collection, initial);

		const entity: ObjectEntity<any> = new ObjectEntity(oid, initial, this, {
			onSubscribed: () => this.onSubscribed(entity),
			onAllUnsubscribed: () => this.onAllUnsubscribed(entity),
		});

		return entity;
	};

	create = async (initial: any, oid: ObjectIdentifier) => {
		assignOid(initial, oid);
		const patches = this.meta.patchCreator.createInitialize(initial, oid);
		// don't enqueue these, submit as distinct operation
		await this.submitOperation(patches);
		return this.get(initial);
	};

	private pendingPatches: Operation[] = [];
	private isOperationEnqueued = false;
	enqueuePatches = (patches: Operation[]) => {
		this.pendingPatches.push(...patches);
		if (!this.isOperationEnqueued) {
			queueMicrotask(this.flushPatches);
			this.isOperationEnqueued = true;
		}
	};

	private flushPatches = async () => {
		console.log('Flushing patches', this.pendingPatches.length);
		await this.submitOperation(this.pendingPatches);
		this.pendingPatches = [];
	};

	private submitOperation = async (patches: Operation[]) => {
		const oldestHistoryTimestamp = await this.meta.insertLocalOperation(
			patches,
		);
		const operation = await this.meta.messageCreator.createOperation({
			patches,
			oldestHistoryTimestamp,
		});
		this.sync.send(operation);
		const affectedDocuments = getRoots(patches.map((p) => p.oid));
		await Promise.all(affectedDocuments.map(this.refresh));
	};

	refresh = async (oid: ObjectIdentifier) => {
		console.log('Refreshing', oid);
		const view = await this.meta.getComputedDocument(oid);
		await this.storeView(oid, view);
		const entity = this.cache.get(oid);
		if (entity) {
			updateEntity(entity, view);
		}
	};

	private storeView = async (oid: ObjectIdentifier, view: any) => {
		if (!view) {
			// TODO: delete from database
		} else {
			const { collection, id } = decomposeOid(oid);
			const stored = { ...view };
			// apply synthetic and compound index values before storing
			Object.assign(
				stored,
				computeSynthetics(this.schema.collections[collection], stored),
			);
			Object.assign(
				stored,
				computeCompoundIndices(this.schema.collections[collection], stored),
			);

			const tx = this.db.transaction(collection, 'readwrite');
			const store = tx.objectStore(collection);
			await storeRequestPromise(store.put(stored));
		}
	};

	private stripIndexes = (collection: string, view: any) => {
		const { synthetics, compounds } = this.schema.collections[
			collection
		] as StorageCollectionSchema<any, any, any>;
		for (const synthetic of Object.keys(synthetics)) {
			delete view[synthetic];
		}
		for (const compoundIndex of Object.keys(compounds)) {
			delete view[compoundIndex];
		}
	};
}
