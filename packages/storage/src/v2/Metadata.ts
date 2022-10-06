import {
	applyPatch,
	ObjectIdentifier,
	PatchCreator,
	StorageSchema,
	substituteRefsWithObjects,
	SyncOperation,
	assignOid,
	getOidRoot,
} from '@aglio/storage-common';
import { EventSubscriber } from '../EventSubscriber.js';
import { storeRequestPromise } from '../idb.js';
import type { Sync } from '../Sync.js';
import { AckInfoStore } from './AckInfoStore.js';
import { BaselinesStore } from './BaselinesStore.js';
import { LocalHistoryStore } from './LocalHistoryStore.js';
import { LocalReplicaStore } from './LocalReplicaStore.js';
import { MessageCreator } from './MessageCreator.js';
import { ClientPatch, PatchesStore } from './PatchesStore.js';
import { SchemaStore } from './SchemaStore.js';

export class Metadata extends EventSubscriber<{
	documentsChanged: (oids: ObjectIdentifier[]) => void;
}> {
	readonly patches = new PatchesStore(this.db);
	readonly baselines = new BaselinesStore(this.db);
	readonly localReplica = new LocalReplicaStore(this.db);
	readonly ackInfo = new AckInfoStore(this.db);
	readonly schema = new SchemaStore(this.db, this.schemaDefinition.version);
	readonly localHistory = new LocalHistoryStore(this.db);
	readonly messageCreator = new MessageCreator(this);
	readonly patchCreator = new PatchCreator(() => this.now);

	constructor(
		private readonly db: IDBDatabase,
		readonly sync: Sync,
		private readonly schemaDefinition: StorageSchema<any>,
	) {
		super();
	}

	get now() {
		return this.sync.time.now(this.schema.currentVersion);
	}

	/**
	 * Methods for accessing data
	 */

	/**
	 * Recomputes an entire document from stored patches and baselines.
	 */
	getComputedView = async <T = any>(
		oid: ObjectIdentifier,
		upToTimestamp?: string,
	): Promise<T | undefined> => {
		console.debug('Computing view of', oid);
		const baselines = await this.baselines.getAllForDocument(oid);
		const subObjectsMappedByOid = new Map<ObjectIdentifier, any>();
		for (const baseline of baselines) {
			subObjectsMappedByOid.set(baseline.oid, baseline.snapshot);
		}

		await this.patches.iterateOverAllPatchesForDocument(
			oid,
			(patch) => {
				console.debug('Applying patch', patch);
				let current = subObjectsMappedByOid.get(patch.oid);
				current = applyPatch(current, patch);
				subObjectsMappedByOid.set(patch.oid, current);
			},
			{
				to: upToTimestamp,
			},
		);

		// assemble the various sub-objects into the document by
		// placing them where their ref is
		const rootBaseline = subObjectsMappedByOid.get(oid) ?? ({} as any);
		// critical: attach metadata
		assignOid(rootBaseline, oid);
		const usedOids = substituteRefsWithObjects(
			rootBaseline,
			subObjectsMappedByOid,
		);

		// TODO: set difference of used OIDs versus stored baseline OIDs, clean up
		// orphaned baselines.

		// asserting T type - even if baseline is an empty object, applying
		// operations should conform it to the final shape.
		return rootBaseline as T | undefined;
	};

	/**
	 * Methods for writing data
	 */

	/**
	 * Acks that we have seen a timestamp to the server
	 * and stores it as our local ackedLogicalTime if it's
	 * greater than our current ackedLogicalTime.
	 */
	ack = async (timestamp: string) => {
		const localReplicaInfo = await this.localReplica.get();
		this.sync.send({
			type: 'ack',
			replicaId: localReplicaInfo.id,
			timestamp,
		});
		if (
			!localReplicaInfo.ackedLogicalTime ||
			timestamp > localReplicaInfo.ackedLogicalTime
		) {
			this.localReplica.update({ ackedLogicalTime: timestamp });
		}
	};

	/**
	 * Returns a list of the root document OIDs for all entities
	 * modified in a set of patches
	 */
	private rootOidsFromList(source: ObjectIdentifier[]): ObjectIdentifier[] {
		return Array.from(
			new Set<ObjectIdentifier>(source.map((oid) => getOidRoot(oid))),
		);
	}

	/**
	 * Applies a patch to the document and stores it in the database.
	 * @returns the oldest local history timestamp
	 */
	insertLocalOperation = async (item: SyncOperation) => {
		await this.patches.addPatches(
			item.patches.map((patch) => ({
				...patch,
				replicaId: item.replicaId,
				operationId: item.id,
			})),
		);

		const oldestHistoryTimestamp = await this.localHistory.add({
			operationId: item.id,
			timestamp: item.timestamp,
		});

		this.tryAutonomousRebase(oldestHistoryTimestamp);

		this.emit(
			'documentsChanged',
			this.rootOidsFromList(item.patches.map((p) => p.oid)),
		);

		return oldestHistoryTimestamp;
	};

	/**
	 * Inserts remote operations. This does not affect local history.
	 * @returns a list of affected document OIDs
	 */
	insertRemoteOperations = async (items: SyncOperation[]) => {
		const affectedOids = await this.patches.addPatches(
			items.flatMap((operation) =>
				operation.patches.map((patch) => ({
					...patch,
					replicaId: operation.replicaId,
					operationId: operation.id,
				})),
			),
		);
		this.emit('documentsChanged', this.rootOidsFromList(affectedOids));
	};

	updateLastSynced = async () => {
		return this.localReplica.update({
			lastSyncedLogicalTime: this.now,
		});
	};

	/**
	 * Determines if the local client can do independent rebases.
	 * This is only the case if the client has never synced
	 * with a server (entirely offline mode)
	 *
	 * TODO:
	 * This might be able to be expanded in the future, I feel
	 * like there's some combination of "history is all my changes"
	 * plus global ack which could allow squashing operations for
	 * single objects.
	 */
	private async canAutonomouslyRebase() {
		return !(await this.localReplica.get()).lastSyncedLogicalTime;
	}

	/**
	 * Attempt to autonomously rebase local documents without server intervention.
	 * This can currently only happen for a client who has never synced before.
	 * The goal is to allow local-only clients to compress their history to exactly
	 * their undo stack.
	 */
	private tryAutonomousRebase = async (oldestHistoryTimestamp: string) => {
		if (!(await this.canAutonomouslyRebase())) {
			return;
		}

		const localInfo = await this.localReplica.get();

		// find all operations before the oldest history timestamp
		const priorOperations = new Array<ClientPatch>();
		await this.patches.iterateOverAllPatchesForReplica(
			localInfo.id,
			(patch) => {
				priorOperations.push(patch);
			},
			{
				before: oldestHistoryTimestamp,
			},
		);

		if (!priorOperations.length) {
			return;
		}

		// gather all oids affected
		const toRebase = new Set<ObjectIdentifier>();
		for (const op of priorOperations) {
			toRebase.add(getOidRoot(op.oid));
		}
		const lastOperation = priorOperations[priorOperations.length - 1];

		// rebase each affected document
		for (const oid of toRebase) {
			await this.rebase(oid, lastOperation.timestamp);
		}
	};

	rebase = async (oid: ObjectIdentifier, upTo: string) => {
		const view = await this.getComputedView(oid, upTo);
		await this.baselines.set({
			oid,
			snapshot: view,
			timestamp: upTo,
		});
		// separate iteration to ensure the above has completed before destructive
		// actions. TODO: use a transaction instead
		await this.patches.iterateOverAllPatchesForDocument(
			oid,
			(op, store) => {
				store.delete(op.oid_timestamp);
			},
			{
				to: upTo,
				mode: 'readwrite',
			},
		);

		console.log('successfully rebased', oid, 'up to', upTo);
	};

	stats = async () => {
		const db = await this.db;
		// total number of operations
		const transaction = db.transaction(['operations', 'info'], 'readonly');
		const opsStore = transaction.objectStore('operations');
		const request = opsStore.count();
		const count = await storeRequestPromise<number>(request);

		const infoStore = transaction.objectStore('info');
		const localHistoryRequest = infoStore.get('localHistory');
		const history = await this.localHistory.get();

		return {
			operationCount: count,
			localHistoryLength: history?.items.length || 0,
		};
	};
}

export function openMetadataDatabase(indexedDB: IDBFactory) {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open('meta', 1);
		request.onupgradeneeded = (event) => {
			const db = request.result;
			// version 1: operations list, baselines, and local info
			if (!event.oldVersion) {
				const baselinesStore = db.createObjectStore('baselines', {
					keyPath: 'oid',
				});
				const patchesStore = db.createObjectStore('patches', {
					keyPath: 'oid_timestamp',
				});
				const infoStore = db.createObjectStore('info', { keyPath: 'type' });
				baselinesStore.createIndex('timestamp', 'timestamp');
				patchesStore.createIndex('replicaId_timestamp', 'replicaId_timestamp');
				patchesStore.createIndex(
					'documentOid_timestamp',
					'documentOid_timestamp',
				);
			}
		};
		request.onerror = () => {
			console.error('Error opening database', request.error);
			reject(request.error);
		};
		request.onsuccess = () => {
			resolve(request.result);
		};
	});
}
