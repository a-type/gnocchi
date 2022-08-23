import {
	AckMessage,
	ClientMessage,
	OperationMessage,
	SERVER_REPLICA_ID,
	SyncMessage,
	SyncStep2Message,
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
			case 'sync-step2':
				return this.handleSyncStep2(message, clientId);
			case 'ack':
				return this.handleAck(message, clientId);
			default:
				console.log('Unknown message type', (message as any).type);
				break;
		}
	};

	private handleOperation = (message: OperationMessage) => {
		const collection = this.collections.open(message.op.collection);

		const run = this.db.transaction(() => {
			// apply the operation to the document
			collection.receive(message);

			// update client's oldest timestamp
			this.replicas.updateOldestOperationTimestamp(
				message.op.replicaId,
				message.op.timestamp,
			);
		});

		run();

		// TODO: enqueue a rebase

		const globalAck = this.replicas.getGlobalAck();

		// rebroadcast to whole library except the sender
		this.sender.broadcast(
			this.id,
			{
				type: 'op-re',
				op: message.op,
				globalAckTimestamp: globalAck,
			},
			[message.op.replicaId],
		);
	};

	private handleSync = (message: SyncMessage, clientId: string) => {
		const replicaId = message.replicaId;
		const clientReplicaInfo = this.replicas.getOrCreate(replicaId, clientId);

		// respond to client

		// lookup operations after the last ack the client gave us
		const ops = this.operations.getAfter(clientReplicaInfo.ackedLogicalTime);
		const baselines = this.baselines.getAllAfter(
			clientReplicaInfo.ackedLogicalTime,
		);

		this.sender.send(this.id, replicaId, {
			type: 'sync-resp',
			ops,
			baselines: baselines.map((baseline) => ({
				documentId: baseline.documentId,
				snapshot: baseline.snapshot,
				timestamp: baseline.timestamp,
			})),
			provideChangesSince: clientReplicaInfo.ackedLogicalTime,
			globalAckTimestamp: this.replicas.getGlobalAck(),
		});
	};

	private handleSyncStep2 = (message: SyncStep2Message, clientId: string) => {
		// store all incoming operations and baselines
		this.baselines.insertAll(message.baselines);

		console.debug('Storing', message.ops.length, 'operations');
		this.operations.insertAll(message.ops);

		// update the client's ackedLogicalTime
		const lastOperation = message.ops[message.ops.length - 1];
		if (lastOperation) {
			this.replicas.updateAcknowledged(
				message.replicaId,
				lastOperation.timestamp,
			);
		}
	};

	private setupServerReplica = () => {
		this.replicas.getOrCreate(SERVER_REPLICA_ID, null);
	};

	private handleAck = (message: AckMessage, clientId: string) => {
		this.replicas.updateAcknowledged(message.replicaId, message.timestamp);
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
