import {
	HeartbeatMessage,
	PresenceUpdateMessage,
	SyncMessage,
	SyncOperation,
	SyncResponseMessage,
	SyncStep2Message,
	TimestampProvider,
} from '@aglio/storage-common';
import { getOidRoot } from '@aglio/storage-common/src/oids.js';
import cuid from 'cuid';
import { LocalReplicaStore } from './LocalReplicaStore.js';
import { Metadata } from './Metadata.js';

export class MessageCreator {
	constructor(private meta: Metadata) {}

	createOperation = async (
		init: Pick<SyncOperation, 'patches'> & {
			timestamp?: string;
		},
	): Promise<SyncOperation> => {
		const localInfo = await this.meta.localReplica.get();
		return {
			timestamp: this.meta.now,
			...init,
			replicaId: localInfo.id,
			id: cuid(),
		};
	};

	createMigrationOperation = async ({
		targetVersion,
		...init
	}: Pick<SyncOperation, 'patches'> & {
		targetVersion: number;
	}): Promise<SyncOperation> => {
		const localInfo = await this.meta.localReplica.get();
		return {
			...init,
			timestamp: this.meta.sync.time.zero(targetVersion),
			replicaId: localInfo.id,
			id: cuid(),
		};
	};

	createSyncStep1 = async (): Promise<SyncMessage> => {
		const localReplicaInfo = await this.meta.localReplica.get();

		return {
			type: 'sync',
			schemaVersion: this.meta.schema.currentVersion,
			timestamp: this.meta.now,
			replicaId: localReplicaInfo.id,
		};
	};

	/**
	 * Pulls all local operations the server has not seen.
	 */
	createSyncStep2 = async (
		provideChangesSince: SyncResponseMessage['provideChangesSince'],
	): Promise<SyncStep2Message> => {
		const localReplicaInfo = await this.meta.localReplica.get();
		// collect all of our operations that are newer than the server's last operation
		// if server replica isn't stored, we're syncing for the first time.
		const operations = await this.meta.operations.getAllOperationsFromReplica(
			localReplicaInfo.id,
			{
				after: provideChangesSince,
			},
		);
		// for now we just send every baseline for every
		// affected document... TODO: optimize this
		const affectedDocs = new Set(
			operations
				.flatMap((op) => op.patches)
				.map((patch) => getOidRoot(patch.oid)),
		);
		const baselines = await this.meta.baselines.getAllForMultipleDocuments(
			Array.from(affectedDocs),
		);

		return {
			type: 'sync-step2',
			timestamp: this.meta.now,
			ops: operations,
			// don't send empty baselines
			baselines: baselines.filter(Boolean),
			replicaId: localReplicaInfo.id,
		};
	};

	createPresenceUpdate = async (
		presence: any,
	): Promise<PresenceUpdateMessage> => {
		const localReplicaInfo = await this.meta.localReplica.get();
		return {
			type: 'presence-update',
			presence,
			replicaId: localReplicaInfo.id,
		};
	};

	createHeartbeat = async (): Promise<HeartbeatMessage> => {
		const localReplicaInfo = await this.meta.localReplica.get();
		return {
			type: 'heartbeat',
			timestamp: this.meta.now,
			replicaId: localReplicaInfo.id,
		};
	};
}
