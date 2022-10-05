import { assignOid, OperationPatch } from '@aglio/storage-common';
import { getOid, ObjectIdentifier } from '@aglio/storage-common';
import { EntityBase, ObjectEntity, updateEntity } from './Entity.js';
import { Metadata } from './Metadata.js';
import { SyncHarness } from './SyncHarness.js';

export class EntityStore {
	private cache = new Map<string, EntityBase<any>>();

	constructor(
		private readonly db: IDBDatabase,
		public readonly meta: Metadata,
		private readonly sync: SyncHarness,
	) {
		this.meta.subscribe('documentsChanged', this.handleDocumentsChanged);
	}

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

	create = (initial: any, oid: ObjectIdentifier) => {
		assignOid(initial, oid);
		const patches = this.meta.patchCreator.createInitialize(initial, oid);
		this.enqueuePatches(patches);
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
		const operation = await this.meta.messageCreator.createOperation({
			patches: this.pendingPatches,
		});
		const oldestHistoryTimestamp = await this.meta.insertLocalOperation(
			operation,
		);
		this.sync.send({
			type: 'op',
			oldestHistoryTimestamp,
			op: operation,
			replicaId: operation.replicaId,
		});
		this.pendingPatches = [];
	};

	private handleDocumentsChanged = async (oids: ObjectIdentifier[]) => {
		for (const oid of oids) {
			const entity = this.cache.get(oid);
			if (entity) {
				updateEntity(entity, await this.meta.getComputedView(oid));
			}
		}
	};
}
