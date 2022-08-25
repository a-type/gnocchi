import cuid from 'cuid';
import { describe, it, expect, vi } from 'vitest';
import { subscribe } from '../src/index.js';
import { createTestStorage } from './fixtures/testStorage';

describe('storage documents', () => {
	it('should have a stable identity across different queries', async () => {
		const storage = createTestStorage();

		const todos = storage.get('todo');

		const item1 = await todos.create({
			id: cuid(),
			content: 'item 1',
			done: false,
		});
		const item2 = await todos.create({
			id: cuid(),
			content: 'item 2',
			done: true,
		});

		const singleItemQuery = todos.get(item1.id);
		const allItemsQuery = todos.getAll();

		const singleItemResult = await singleItemQuery.resolved;
		const allItemsResult = await allItemsQuery.resolved;
		const allItemsReferenceToItem1 = allItemsResult.find(
			(item) => item.id === item1.id,
		);
		expect(singleItemResult).toEqual(allItemsReferenceToItem1);
	});

	it('should notify about changes', async () => {
		const storage = createTestStorage();

		const todos = storage.get('todo');

		const item1 = await todos.create({
			id: cuid(),
			content: 'item 1',
			done: false,
		});

		const liveItem1 = await todos.get(item1.id).resolved;
		const callback = vi.fn();
		subscribe(liveItem1!, callback);

		await todos.update(item1.id, {
			content: 'item 1 updated',
			done: true,
		});

		expect(callback).toBeCalledTimes(1);
		expect(callback).toBeCalledWith({
			id: item1.id,
			content: 'item 1 updated',
			done: true,
		});
	});

	it('should expose a mutator to update properties', async () => {
		const storage = createTestStorage();

		const todos = storage.get('todo');

		const item1 = await todos.create({
			id: cuid(),
			content: 'item 1',
			done: false,
		});

		const liveItem1 = await todos.get(item1.id).resolved;
		const callback = vi.fn();
		subscribe(liveItem1!, callback);

		liveItem1!.$update({
			content: 'item 1 updated',
			done: true,
		});

		// fields are immediately updated
		expect(liveItem1!.done).toBe(true);
		expect(liveItem1!.content).toBe('item 1 updated');

		// wait for the change to propagate to storage
		await new Promise<void>((resolve, reject) => {
			// timeout after 3s waiting
			const timeout = setTimeout(
				() => reject(new Error('Waiting for storage change timed out')),
				3000,
			);
			const interval = setInterval(() => {
				if (callback.mock.calls.length > 0) {
					clearInterval(interval);
					clearTimeout(timeout);
					resolve();
				}
			}, 0);
		});

		expect(callback).toBeCalledTimes(1);
		expect(callback).toBeCalledWith({
			id: item1.id,
			content: 'item 1 updated',
			done: true,
		});
	});
});
