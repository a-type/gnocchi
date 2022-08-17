import { WebSocketServer } from 'ws';
import Db from 'better-sqlite3';
import { ServerStorage } from '@aglio/storage-server';
import * as fs from 'fs';
import { createServer } from 'http';
import express from 'express';

let wss: WebSocketServer;
let storage: ServerStorage;

export async function start() {
	const app = express();
	const server = createServer(app);

	app.get('/client/:clientId', express.static('/dist'));

	wss = new WebSocketServer({
		server,
	});

	const db = new Db('./db.sqlite', {
		fileMustExist: false,
	});
	storage = new ServerStorage(db);

	storage.createSchema();

	wss.on('message', (data) => {
		// for test purposes the client just announces
		// their ID in each message. no authorization.
		const message = JSON.parse(data.toString());
		storage.receive(message.libraryId, message.body, message.clientId);
	});

	server.listen(8888);
	console.log('server ready on :8888');
}

export async function stop() {
	wss.close();
	fs.rmSync('./db.sqlite');
}
