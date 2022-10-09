import {
	applyPatch,
	ObjectIdentifier,
	PatchCreator,
	StorageSchema,
	substituteRefsWithObjects,
	assignOid,
	getOidRoot,
	omit,
	OperationPatch,
	Operation,
} from '@aglio/storage-common';
import { storeRequestPromise } from './idb.js';
import type { Sync } from './Sync.js';
import { AckInfoStore } from './AckInfoStore.js';
import { BaselinesStore } from './BaselinesStore.js';
import { LocalHistoryStore } from './LocalHistoryStore.js';
import { LocalReplicaStore } from './LocalReplicaStore.js';
import { MessageCreator } from './MessageCreator.js';
import { ClientPatch, PatchesStore } from './PatchesStore.js';
import { SchemaStore } from './SchemaStore.js';

export class Metadata {
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
	) {}

	get now() {
		return this.sync.time.now(this.schema.currentVersion);
	}

	/**
	 * Methods for accessing data
	 */

	/**
	 * Recomputes an entire document from stored patches and baselines.
	 */
	getComputedDocument = async <T = any>(
		oid: ObjectIdentifier,
		upToTimestamp?: string,
	): Promise<T | undefined> => {
		console.debug('Computing view of', oid);
		const baselines = await this.baselines.getAllForDocument(oid);
		console.debug('Baselines:', baselines);
		const subObjectsMappedByOid = new Map<ObjectIdentifier, any>();
		for (const baseline of baselines) {
			subObjectsMappedByOid.set(baseline.oid, baseline.snapshot);
		}

		let lastPatchWasDelete = false;

		await this.patches.iterateOverAllPatchesForDocument(
			oid,
			(patch) => {
				let current = subObjectsMappedByOid.get(patch.oid);
				current = applyPatch(current, patch.data);
				subObjectsMappedByOid.set(patch.oid, current);
				lastPatchWasDelete = patch.data.op === 'delete';
			},
			{
				to: upToTimestamp,
			},
		);

		// assemble the various sub-objects into the document by
		// placing them where their ref is
		const rootBaseline = subObjectsMappedByOid.get(oid);
		// critical: attach metadata
		if (rootBaseline) {
			assignOid(rootBaseline, oid);
			const usedOids = substituteRefsWithObjects(
				rootBaseline,
				subObjectsMappedByOid,
			);
		}

		// TODO: set difference of used OIDs versus stored baseline OIDs, clean up
		// orphaned baselines.

		// asserting T type - even if baseline is an empty object, applying
		// operations should conform it to the final shape.

		// FIXME: this is a fragile check for deleted
		if (lastPatchWasDelete || !rootBaseline) {
			return undefined;
		}

		return rootBaseline as T;
	};

	/**
	 * Recomputes a normalized view of a single entity object from stored patches
	 * and baseline.
	 */
	getComputedEntity = async <T = any>(
		oid: ObjectIdentifier,
		upToTimestamp?: string,
	): Promise<T | undefined> => {
		const baseline = await this.baselines.get(oid);
		let current: any = baseline?.snapshot || undefined;
		let patchesApplied = 0;
		await this.patches.iterateOverAllPatchesForEntity(
			oid,
			(patch) => {
				current = applyPatch(current, patch.data);
				patchesApplied++;
			},
			{
				to: upToTimestamp,
			},
		);
		console.log('Computed', oid, 'from', patchesApplied, 'patches:', current);
		return current as T | undefined;
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
	 * Applies a patch to the document and stores it in the database.
	 * @returns the oldest local history timestamp
	 */
	insertLocalOperation = async (patches: Operation[]) => {
		if (patches.length === 0) return;

		const localReplicaInfo = await this.localReplica.get();
		await this.patches.addPatches(
			patches.map((patch) => ({
				...patch,
				isLocal: true,
			})),
		);

		const oldestHistoryTimestamp = await this.localHistory.add({
			timestamp: patches[patches.length - 1].timestamp,
		});

		this.tryAutonomousRebase(oldestHistoryTimestamp);

		return oldestHistoryTimestamp;
	};

	/**
	 * Inserts remote operations. This does not affect local history.
	 * @returns a list of affected document OIDs
	 */
	insertRemoteOperations = async (patches: Operation[]) => {
		if (patches.length === 0) return [];

		const affectedOids = await this.patches.addPatches(
			patches.map((patch) => ({
				...patch,
				isLocal: false,
			})),
		);

		this.ack(patches[patches.length - 1].timestamp);

		return affectedOids;
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
		await this.patches.iterateOverAllLocalPatches(
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
			toRebase.add(op.oid);
		}
		const lastOperation = priorOperations[priorOperations.length - 1];

		// rebase each affected document
		for (const oid of toRebase) {
			await this.rebase(oid, lastOperation.timestamp);
		}
	};

	rebase = async (oid: ObjectIdentifier, upTo: string) => {
		console.log('Rebasing', oid, 'up to', upTo);
		const view = await this.getComputedEntity(oid, upTo);
		await this.baselines.set({
			oid,
			snapshot: view,
			timestamp: upTo,
		});
		// separate iteration to ensure the above has completed before destructive
		// actions. TODO: use a transaction instead
		await this.patches.iterateOverAllPatchesForEntity(
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
		console.log('latest baseline of', oid, 'is', view);
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

export function openMetadataDatabase(indexedDB: IDBFactory = window.indexedDB) {
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
				patchesStore.createIndex('isLocal_timestamp', 'isLocal_timestamp');
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
