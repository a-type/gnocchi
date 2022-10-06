import {
	assignOid,
	decomposeOid,
	getRoots,
	OperationPatch,
} from '@aglio/storage-common';
import { getOid, ObjectIdentifier } from '@aglio/storage-common';
import { storeRequestPromise } from '../idb.js';
import { Sync } from '../Sync.js';
import { EntityBase, ObjectEntity, updateEntity } from './Entity.js';
import { Metadata } from './Metadata.js';

export class EntityStore {
	private cache = new Map<string, EntityBase<any>>();

	constructor(
		private readonly db: IDBDatabase,
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

		const entity: ObjectEntity<any> = new ObjectEntity(oid, initial, this, {
			onSubscribed: () => this.onSubscribed(entity),
			onAllUnsubscribed: () => this.onAllUnsubscribed(entity),
		});

		return entity;
	};

	create = async (initial: any, oid: ObjectIdentifier) => {
		assignOid(initial, oid);
		const patches = this.meta.patchCreator.createInitialize(initial, oid);
		console.debug('Creating', oid, 'with patches', patches);
		// don't enqueue these, submit as distinct operation
		await this.submitOperation(patches);
		return this.get(initial);
	};

	private pendingPatches: OperationPatch[] = [];
	private isOperationEnqueued = false;
	enqueuePatches = (patches: OperationPatch[]) => {
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

	private submitOperation = async (patches: OperationPatch[]) => {
		const operation = await this.meta.messageCreator.createOperation({
			patches,
		});
		console.log(operation);
		const oldestHistoryTimestamp = await this.meta.insertLocalOperation(
			operation,
		);
		this.sync.send({
			type: 'op',
			oldestHistoryTimestamp,
			op: operation,
			replicaId: operation.replicaId,
		});
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
		console.log('Storing view', oid, view);
		if (!view) {
			// TODO: delete from database
		} else {
			const { collection, id } = decomposeOid(oid);
			const tx = this.db.transaction(collection, 'readwrite');
			const store = tx.objectStore(collection);
			await storeRequestPromise(store.put(view));
		}
	};
}
