import { ClientMessage, ServerMessage } from '@aglio/storage-common';
import { IncomingMessage, Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { getLoginSession, Session } from '@aglio/auth';
import { verifySubscription } from './auth/verifySubscription.js';
import { outgoingMessages } from './data/storage/outgoingMessages.js';
import { storage } from './data/storage/storage.js';

async function authenticate(req: IncomingMessage): Promise<Session> {
	const session = await getLoginSession(req);
	if (!session) {
		throw new Error('Not authenticated');
	}

	await verifySubscription(session);

	return session;
}

/**
 * Once a connection identifies its replicaId (via the
 * initial sync message), we associate them so we can deliver
 * replica-specific messages to the right client.
 */
const replicaToConnectionMap = new Map<string, WebSocket>();
/**
 * Likewise we group clients by libraryId so we can broadcast
 * to all clients in a library.
 */
const libraryToConnectionMap = new Map<string, WebSocket[]>();
const connectionToReplicaIdMap = new WeakMap<WebSocket, string>();

export function attachSocketServer(server: Server) {
	const wss = new WebSocketServer({
		noServer: true,
	});

	wss.on('connection', (ws: WebSocket, request: Request, identity: Session) => {
		// add the client to its library group
		const libraryId = identity.planId;
		const connections = libraryToConnectionMap.get(libraryId) || [];
		connections.push(ws);
		libraryToConnectionMap.set(libraryId, connections);

		ws.on('message', (message) => {
			const data = JSON.parse(message.toString()) as ClientMessage;

			if (data.type === 'sync') {
				replicaToConnectionMap.set(data.replicaId, ws);
				connectionToReplicaIdMap.set(ws, data.replicaId);
			}

			storage.receive(identity.planId, data, identity.userId);
		});
	});

	server.on('upgrade', async (req, socket, head) => {
		try {
			const identity = await authenticate(req);

			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, req, identity);
			});
		} catch (e) {
			console.error(e);
			socket.destroy();
		}
	});

	// listen for outgoing messages on our bus and
	// forward them to the appropriate clients
	outgoingMessages.on(
		'broadcast',
		(libraryId: string, message: ServerMessage, omitReplicas: string[]) => {
			const connections = libraryToConnectionMap.get(libraryId) || [];
			connections.forEach((connection) => {
				const replicaId = connectionToReplicaIdMap.get(connection);
				if (replicaId && !omitReplicas.includes(replicaId)) {
					connection.send(JSON.stringify(message));
				}
			});
		},
	);

	outgoingMessages.on('send', (replicaId: string, message: ServerMessage) => {
		const connection = replicaToConnectionMap.get(replicaId);
		if (connection) {
			connection.send(JSON.stringify(message));
		}
	});
}
