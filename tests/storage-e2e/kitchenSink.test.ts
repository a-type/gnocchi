import { describe, beforeAll, afterAll, it } from 'vitest';
import { start as startServer, stop as stopServer } from './testServer';
import { start as startClient, stop as stopClient } from './testClient';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

describe('kitchen sink storage test', () => {
	let clientA: UnwrapPromise<ReturnType<typeof startClient>>;
	let clientB: UnwrapPromise<ReturnType<typeof startClient>>;

	beforeAll(async () => {
		await startServer();
		clientA = await startClient('a');
		clientB = await startClient('b');
	});

	afterAll(async () => {
		await stopServer();
		await clientA.stop();
		await clientB.stop();
		await stopClient();
	});

	it('should sync data', async () => {
		const item = await clientA.createTodo('test 1');
	});
});
