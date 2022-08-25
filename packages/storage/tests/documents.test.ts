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

		expect(callback).toBeCalledWith({
			id: item1.id,
			content: 'item 1 updated',
			done: true,
		});
	});
});
