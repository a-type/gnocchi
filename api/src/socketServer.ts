import { IncomingMessage, Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { getLoginSession } from './auth';
import { Session } from './auth/session';
import { syncService } from './sync/syncService';

async function authenticate(req: IncomingMessage): Promise<Session> {
	const session = await getLoginSession(req);
	if (!session) {
		throw new Error('Not authenticated');
	}

	return session;
}

export function attachSocketServer(server: Server) {
	const wss = new WebSocketServer({
		noServer: true,
	});

	wss.on('connection', (ws: WebSocket, request: Request, identity: Session) => {
		ws.on('message', async (message) => {
			const messageData = message.toString('utf-8');
			console.log('received: %s', messageData, 'from', identity.name);
			try {
				await syncService.handleMessage(messageData, identity);
			} catch (err: any) {
				console.error(err);
				ws.send(
					JSON.stringify({
						error: err.message,
					}),
				);
			}
		});

		ws.send('hello');
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
}
