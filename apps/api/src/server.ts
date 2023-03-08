import express from 'express';
import bodyParser from 'body-parser';
import { attachSocketServer } from './lofi/lofi.js';
import { createServer } from 'http';
import cors from 'cors';
import apiRouter from './api/index.js';
import { createTrpcMiddleware } from './rpc/index.js';
import { productAdminSetup } from './tasks/productAdminSetup.js';

const app = express();
const server = createServer(app);

app.use(
	cors({
		origin: [
			'http://localhost:8080',
			'http://localhost:4444',
			'http://127.0.0.1:4444',
			'http://localhost:4173',
			'https://aglio.gfor.rest',
			'https://aglio.app',
			'https://www.aglio.app',
			'https://gnocchi.club',
			'https://www.gnocchi.club',
			process.env.CORS_ALLOW_ORIGIN,
		].filter((o): o is string => !!o),
		credentials: true,
	}),
);
app.use((req, res, next) => {
	// log the request details
	console.log(new Date().toISOString(), req.method, req.url.split('?')[0]);
	next();
});
app.use((req, res, next) => {
	if (req.originalUrl.includes('/webhook')) {
		next();
	} else {
		bodyParser.json({
			limit: '50mb',
		})(req, res, next);
	}
});
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send("Hello World! You shouldn't be here!");
});

app.use('/api', apiRouter);

const lofiServer = attachSocketServer(server);
app.post('/lofi', async (req, res) => {
	await lofiServer.handleRequest(req, res);
});
app.get('/lofi', async (req, res) => {
	await lofiServer.handleRequest(req, res);
});
app.post('/lofi/files/:fileId', async (req, res) => {
	await lofiServer.handleFileRequest(req, res);
});
app.get('/lofi/files/:fileId', async (req, res) => {
	await lofiServer.handleFileRequest(req, res);
});
app.use('/trpc', createTrpcMiddleware(lofiServer));

server.listen(4445, () => {
	console.log('http://localhost:4445');
});

productAdminSetup();
