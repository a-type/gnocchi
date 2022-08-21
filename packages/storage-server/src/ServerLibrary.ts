import {
	ClientMessage,
	OperationMessage,
	SyncMessage,
} from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { ReplicaInfoStorageManager } from './Replicas.js';
import { MessageSender } from './MessageSender.js';
import { OperationHistory } from './OperationHistory.js';
import { ServerCollectionManager } from './ServerCollection.js';

export class ServerLibrary {
	private collections = new ServerCollectionManager(this.db, this.id);
	private replicas = new ReplicaInfoStorageManager(this.db);
	private operations = new OperationHistory(this.db, this.id);

	constructor(
		private db: Database,
		private sender: MessageSender,
		public readonly id: string,
	) {}

	receive = (message: ClientMessage) => {
		switch (message.type) {
			case 'op':
				return this.handleOperation(message);
			case 'sync':
				return this.handleSync(message);
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
			const client = this.replicas.open(message.replicaInfo.replicaId);
			client.updateOldestOperationTimestamp(message.timestamp);
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

	private handleSync = (message: SyncMessage) => {
		const replicaId = message.replicaInfo.replicaId;
		// note the client's latest timestamp
		const replicaInfoStorage = this.replicas.open(replicaId);
		const priorReplicaInfo = replicaInfoStorage.getOrCreate();

		// store all incoming operations
		this.operations.insertAll(message.ops);

		replicaInfoStorage.updateLastSeen(message.timestamp);

		// respond to client

		// lookup operations after the last time we saw the client
		const ops = this.operations.getAfter(priorReplicaInfo.lastSeenLogicalTime);

		// TODO: OPTIMIZE: just keep this list in memory?
		const peersList = this.replicas.allForLibrary(this.id);
		const peers = peersList.map((peer) => ({
			replicaId: peer.replicaId,
			oldestOperationLogicalTime: peer.oldestOperationLogicalTime,
			lastSeenLogicalTime: peer.lastSeenLogicalTime,
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
			peers,
		});
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
