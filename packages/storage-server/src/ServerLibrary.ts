import {
	ClientMessage,
	OperationMessage,
	SyncMessage,
} from '@aglio/storage-common';
import { Database } from 'better-sqlite3';
import { ClientConnectionDataManager } from './ClientConnectionData.js';
import { MessageSender } from './MessageSender.js';
import { OperationHistory } from './OperationHistory.js';
import { ServerCollectionManager } from './ServerCollection.js';

export class ServerLibrary {
	private collections = new ServerCollectionManager(this.db, this.id);
	private clients = new ClientConnectionDataManager(this.db);
	private operations = new OperationHistory(this.db, this.id);

	constructor(
		private db: Database,
		private sender: MessageSender,
		public readonly id: string,
	) {}

	receive = (message: ClientMessage, clientId: string) => {
		switch (message.type) {
			case 'op':
				return this.handleOperation(message, clientId);
			case 'sync':
				return this.handleSync(message, clientId);
			default:
				console.log('Unknown message type', (message as any).type);
				break;
		}
	};

	private handleOperation = (message: OperationMessage, clientId: string) => {
		const collection = this.collections.open(message.collection);

		const run = this.db.transaction(() => {
			// apply the operation to the document
			collection.receive(message);

			// update client's oldest timestamp
			const client = this.clients.open(clientId);
			client.updateOldestOperationTimestamp(message.timestamp);
		});

		run();

		// TODO: enqueue a rebase

		// rebroadcast to whole library
		this.sender.broadcast(this.id, {
			type: 'op-re',
			clientId,
			op: message,
		});
	};

	private handleSync = (message: SyncMessage, clientId: string) => {
		// lookup operations after the client's requested timestamp
		const ops = this.operations.getAfter(this.id, message.from);

		// note the client's latest timestamp
		const client = this.clients.open(clientId);
		client.updateLastSeen(message.timestamp);

		// respond to client
		// OPTIMIZE: just keep this list in memory?
		const peersList = this.clients.allForLibrary(this.id);
		const peers = peersList.map((peer) => ({
			id: peer.id,
			oldestOperationLogicalTime: peer.oldestOperationLogicalTime,
			lastSeenLogicalTime: peer.lastSeenLogicalTime,
		}));
		this.sender.send(this.id, clientId, {
			type: 'sync-resp',
			ops: ops.map((op) => ({
				type: 'op',
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
