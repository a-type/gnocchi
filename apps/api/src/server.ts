import express from 'express';
import bodyParser from 'body-parser';
import { attachSocketServer } from './socketServer.js';
import { createServer } from 'http';
import cors from 'cors';
import apiRouter from './api/index.js';
import * as trpcExpress from '@trpc/server/adapters/express/dist/trpc-server-adapters-express.cjs.js';
import { middleware } from './rpc/index.js';

const app = express();
const server = createServer(app);

app.use(
	cors({
		origin: [
			'http://localhost:8080',
			'http://localhost:3000',
			'http://127.0.0.1:3000',
			'https://aglio.gfor.rest',
		],
		credentials: true,
	}),
);
app.use((req, res, next) => {
	// log the request details
	console.log(new Date().toISOString(), req.method, req.url);
	next();
});
app.use((req, res, next) => {
	if (req.originalUrl.includes('/webhook')) {
		next();
	} else {
		bodyParser.json()(req, res, next);
	}
});
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api', apiRouter);

app.use('/trpc', middleware);

server.listen(3001, () => {
	console.log('http://localhost:3001');
});

attachSocketServer(server);
