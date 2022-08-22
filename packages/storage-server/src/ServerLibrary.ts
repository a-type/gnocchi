import {
	ClientMessage,
	OperationMessage,
	SERVER_REPLICA_ID,
	SyncMessage,
} from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { ReplicaInfos } from './Replicas.js';
import { MessageSender } from './MessageSender.js';
import { OperationHistory } from './OperationHistory.js';
import { ServerCollectionManager } from './ServerCollection.js';
import { Baselines } from './Baselines.js';

export class ServerLibrary {
	private collections = new ServerCollectionManager(this.db, this.id);
	private replicas = new ReplicaInfos(this.db, this.id);
	private operations = new OperationHistory(this.db, this.id);
	private baselines = new Baselines(this.db, this.id);

	constructor(
		private db: Database,
		private sender: MessageSender,
		public readonly id: string,
	) {
		this.setupServerReplica();
	}

	receive = (message: ClientMessage, clientId: string) => {
		switch (message.type) {
			case 'op':
				return this.handleOperation(message);
			case 'sync':
				return this.handleSync(message, clientId);
			default:
				console.log('Unknown message type', (message as any).type);
				break;
		}
	};

	private handleOperation = (message: OperationMessage) => {
		const collection = this.collections.open(message.collection);

		const run = this.db.transaction(() => {
			// apply the operation to the document
			collection.receive(message);

			// update client's oldest timestamp
			this.replicas.updateOldestOperationTimestamp(
				message.replicaId,
				message.timestamp,
			);
		});

		run();

		// TODO: enqueue a rebase

		// rebroadcast to whole library
		this.sender.broadcast(this.id, {
			type: 'op-re',
			replicaInfo: message.replicaInfo,
			op: message,
		});
	};

	private handleSync = (message: SyncMessage, clientId: string) => {
		const replicaId = message.replicaInfo.id;
		// note the client's latest timestamp
		const priorReplicaInfo = this.replicas.getOrCreate(replicaId, clientId);

		// store all incoming operations
		console.debug('Storing', message.ops.length, 'operations');
		this.operations.insertAll(message.ops);

		this.replicas.updateLastSeen(replicaId, message.timestamp);

		// respond to client

		// lookup operations after the last time we saw the client
		const ops = this.operations.getAfter(priorReplicaInfo.ackedLogicalTime);
		const baselines = this.baselines.getAllAfter(
			priorReplicaInfo.ackedLogicalTime,
		);

		const serverReplicaInfo = this.replicas.getOrCreate(
			SERVER_REPLICA_ID,
			null,
		);

		// TODO: OPTIMIZE: just keep this list in memory?
		const peers = this.replicas.getAll().map((peer) => ({
			id: peer.id,
			oldestOperationLogicalTime: peer.oldestOperationLogicalTime,
			ackedLogicalTime: peer.ackedLogicalTime,
		}));
		this.sender.send(this.id, replicaId, {
			type: 'sync-resp',
			ops: ops.map((op) => ({
				type: 'op',
				id: op.id,
				replicaId: op.replicaId,
				collection: op.collection,
				documentId: op.documentId,
				patch: op.patch,
				timestamp: op.timestamp,
			})),
			replicaInfo: {
				id: serverReplicaInfo.id,
				ackedLogicalTime: serverReplicaInfo.ackedLogicalTime,
				oldestOperationLogicalTime:
					serverReplicaInfo.oldestOperationLogicalTime,
			},
			baselines: baselines.map((baseline) => ({
				documentId: baseline.documentId,
				snapshot: baseline.snapshot,
				timestamp: baseline.timestamp,
			})),
			peers,
		});
	};

	private setupServerReplica = () => {
		this.replicas.getOrCreate(SERVER_REPLICA_ID, null);
	};
}

export class ServerLibraryManager {
	private cache = new Map<string, ServerLibrary>();

	constructor(private db: Database, private sender: MessageSender) {}

	open = (id: string) => {
		if (!this.cache.has(id)) {
			this.cache.set(id, new ServerLibrary(this.db, this.sender, id));
		}

		return this.cache.get(id)!;
	};

	close = (id: string) => {
		this.cache.delete(id);
	};
}
