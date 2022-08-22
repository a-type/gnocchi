import express from 'express';
import bodyParser from 'body-parser';
import { attachSocketServer } from './socketServer.js';
import { createServer } from 'http';
import cors from 'cors';
import apiRouter from './api/index.js';

const app = express();
const server = createServer(app);

app.use(
	cors({
		origin: ['http://localhost:8080', 'https://aglio.gfor.rest'],
		credentials: true,
	}),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api', apiRouter);

server.listen(3001, () => {
	console.log('http://localhost:3001');
});

attachSocketServer(server);
