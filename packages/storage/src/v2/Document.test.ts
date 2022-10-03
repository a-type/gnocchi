import { addOid } from '@aglio/storage-common';
import { describe, expect, it, MockedFunction, vi } from 'vitest';
import { createDocument } from './Document.js';

function testMutations() {
	let counter = 0;
	return {
		applyOperation: vi.fn(),
		createObject: vi.fn().mockImplementation(() => `mock/id:${counter++}`),
	};
}

async function waitForStoragePropagation(mock: MockedFunction<any>) {
	await new Promise<void>((resolve, reject) => {
		// timeout after 3s waiting
		const timeout = setTimeout(
			() => reject(new Error('Waiting for storage change timed out')),
			3000,
		);
		const interval = setInterval(() => {
			if (mock.mock.calls.length > 0) {
				clearInterval(interval);
				clearTimeout(timeout);
				resolve();
			}
		}, 0);
	});
}

describe('Live Documents', () => {
	it('wraps an object with only primitives and provides mutations', async () => {
		const mutations = testMutations();
		const obj = createDocument(
			mutations,
			addOid(
				{
					foo: 1,
					bar: true,
					baz: 'qux',
				},
				'test/1:a',
			),
		);

		expect(obj.get('foo')).toBe(1);
		expect(obj.get('bar')).toBe(true);
		expect(obj.get('baz')).toBe('qux');

		obj.set('foo', 2);
		await waitForStoragePropagation(mutations.applyOperation);
		expect(mutations.applyOperation).toHaveBeenCalledWith({
			patches: [
				{
					op: 'set',
					oid: 'test/1:a',
					name: 'foo',
					value: 2,
				},
			],
		});
	});

	it('wraps nested objects', async () => {
		const mutations = testMutations();
		const obj = createDocument(
			mutations,
			addOid(
				{
					foo: addOid(
						{
							bar: 1,
						},
						'test/2',
					),
				},
				'test/1',
			),
		);

		expect(obj.get('foo').get('bar')).toBe(1);

		obj.get('foo').set('bar', 2);
		await waitForStoragePropagation(mutations.applyOperation);
		expect(mutations.applyOperation).toHaveBeenCalledWith({
			patches: [
				{
					op: 'set',
					oid: 'test/2',
					name: 'bar',
					value: 2,
				},
			],
		});
	});

	it('wraps nested primitive lists', async () => {
		const mutations = testMutations();
		const obj = createDocument(
			mutations,
			addOid(
				{
					foo: addOid([1, 2, 3], 'test/2'),
				},
				'test/1',
			),
		);

		const list = obj.get('foo');

		expect(list.get(0)).toBe(1);
		expect(list.get(1)).toBe(2);
		expect(list.get(2)).toBe(3);

		list.set(0, 4);
		list.push(5);
		await waitForStoragePropagation(mutations.applyOperation);
		expect(mutations.applyOperation).toHaveBeenCalledWith({
			patches: [
				{
					op: 'list-set',
					oid: 'test/2',
					index: 0,
					value: 4,
				},
				{
					op: 'list-push',
					oid: 'test/2',
					value: 5,
				},
			],
		});
	});
});
