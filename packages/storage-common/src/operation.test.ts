import { describe, expect, it } from 'vitest';
import {
	addOid,
	addOidsAtAllLevels,
	applyPatches,
	diffToPatches,
	initialToPatches,
	substituteRefsWithObjects,
} from './operation.js';

describe('patch operations', () => {
	describe('on flat objects', () => {
		it('generates and applies set and remove operations', () => {
			const from = { foo: 'bar', baz: 'qux', zing: 1, '@@oid': 'test/1:a' };
			const to = { foo: 'bar', baz: 'pop', '@@oid': 'test/1:a' };
			const patches = diffToPatches(from, to);
			expect(patches).toEqual([
				{
					oid: 'test/1:a',
					op: 'set',
					name: 'baz',
					value: 'pop',
				},
				{
					oid: 'test/1:a',
					op: 'remove',
					name: 'zing',
				},
			]);
			const result = applyPatches(from, patches);
			expect(result).toEqual(to);
		});
	});
	describe('on nested objects', () => {
		it('replaces whole nested objects', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge', '@@oid': 'test/2:a' },
				'@@oid': 'test/1:a',
			};
			const to = {
				foo: 'bar',
				baz: { qux: 'grault', '@@oid': 'test/2:b' },
				'@@oid': 'test/1:a',
			};
			const patches = diffToPatches(from, to);
			expect(patches).toEqual([
				{
					oid: 'test/1:a',
					op: 'set',
					name: 'baz',
					value: {
						'@@type': 'ref',
						id: 'test/2:b',
					},
				},
				{
					oid: 'test/2:b',
					op: 'set',
					name: 'qux',
					value: 'grault',
				},
			]);
		});
		it('replaces whole nested objects with different ids even if fields are the same', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge', '@@oid': 'test/2:a' },
				'@@oid': 'test/1:a',
			};
			const to = {
				foo: 'bar',
				baz: { qux: 'corge', '@@oid': 'test/2:b' },
				'@@oid': 'test/1:a',
			};
			const patches = diffToPatches(from, to);
			expect(patches).toEqual([
				{
					oid: 'test/1:a',
					op: 'set',
					name: 'baz',
					value: {
						'@@type': 'ref',
						id: 'test/2:b',
					},
				},
				{
					oid: 'test/2:b',
					op: 'set',
					name: 'qux',
					value: 'corge',
				},
			]);
		});
		it('does not replace objects with the same identity and same fields', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge', '@@oid': 'test/2:a' },
				'@@oid': 'test/1:a',
			};
			const to = {
				foo: 'bar',
				baz: { qux: 'corge', '@@oid': 'test/2:a' },
				'@@oid': 'test/1:a',
			};
			const patches = diffToPatches(from, to);
			expect(patches).toEqual([]);
		});
		it('patches sub-objects with same identity', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge', '@@oid': 'test/2:a' },
				'@@oid': 'test/1:a',
			};
			const to = {
				foo: 'bar',
				baz: { qux: 'fig', '@@oid': 'test/2:a' },
				'@@oid': 'test/1:a',
			};
			const patches = diffToPatches(from, to);
			expect(patches).toEqual([
				{
					oid: 'test/2:a',
					op: 'set',
					name: 'qux',
					value: 'fig',
				},
			]);
		});
	});
	describe.todo('on lists of primitives', () => {
		it.todo('pushes items');
		it.todo('sets items');
		it.todo('inserts items');
		it.todo('removes items by index');
		it.todo('removes items by value');
		it.todo('moves items by index');
		it.todo('moves items by value');
	});
	describe.todo('on lists of objects', () => {
		it.todo('pushes items');
		it.todo('moves objects by identity');
		it.todo('removes objects by identity');
	});
	describe.todo('on lists of lists', () => {
		it.todo('rejects operations by value or identity');
	});
});

describe('substituting refs with objects', () => {
	it('does nothing when no refs exist', () => {
		const root = {
			foo: 'bar',
			'@@oid': 'test/1',
		};
		const substituted = substituteRefsWithObjects(root, new Map());
		expect(root).toEqual({
			foo: 'bar',
			'@@oid': 'test/1',
		});
		expect(substituted).toEqual([]);
	});

	it('inserts top level objects with oids', () => {
		const root = {
			foo: {
				'@@type': 'ref',
				id: 'test/1:a',
			},
			qux: 1,
			'@@oid': 'test/1',
		};
		const substituted = substituteRefsWithObjects(
			root,
			new Map([['test/1:a', { foo: 'bar' }]]),
		);
		expect(root).toEqual({
			foo: {
				foo: 'bar',
				'@@oid': 'test/1:a',
			},
			qux: 1,
			'@@oid': 'test/1',
		});
		expect(substituted).toEqual(['test/1:a']);
	});

	it('inserts nested objects with oids', () => {
		const root = {
			foo: {
				'@@type': 'ref',
				id: 'test/1:a',
			},
			'@@oid': 'test/1',
		};
		const substituted = substituteRefsWithObjects(
			root,
			new Map([
				[
					'test/1:a',
					{
						foo: 'bar',
						baz: {
							'@@type': 'ref',
							id: 'test/1:b',
						},
					},
				],
				[
					'test/1:b',
					{
						qux: 'corge',
					},
				],
			]),
		);
		expect(root).toEqual({
			foo: {
				foo: 'bar',
				baz: {
					qux: 'corge',
					'@@oid': 'test/1:b',
				},
				'@@oid': 'test/1:a',
			},
			'@@oid': 'test/1',
		});
		expect(substituted).toEqual(['test/1:a', 'test/1:b']);
	});

	it('substitutes arrays of objects', () => {
		const root = {
			foo: {
				'@@type': 'ref',
				id: 'test/1:c',
			},
			'@@oid': 'test/1',
		};
		const substituted = substituteRefsWithObjects(
			root,
			new Map([
				[
					'test/1:c',
					{
						'@@oid': 'test/1:c',
						'@@type': 'list',
						items: [
							{
								'@@type': 'ref',
								id: 'test/1:a',
							},
							{
								'@@type': 'ref',
								id: 'test/1:b',
							},
						],
					},
				],
				[
					'test/1:a',
					{
						foo: 'bar',
						'@@oid': 'test/1:a',
					},
				],
				[
					'test/1:b',
					{
						qux: 'corge',
						'@@oid': 'test/1:b',
					},
				],
			]),
		);
		expect(root).toEqual({
			foo: addOid(
				[
					{
						foo: 'bar',
						'@@oid': 'test/1:a',
					},
					{
						qux: 'corge',
						'@@oid': 'test/1:b',
					},
				],
				'test/1:c',
			),
			'@@oid': 'test/1',
		});
		expect(substituted).toEqual(['test/1:c', 'test/1:a', 'test/1:b']);
	});

	it.todo('substitutes arrays of arrays of objects');
});

describe('creating patches from initial state', () => {
	it('adds oids to all sub-objects', async () => {
		let i = 0;
		function createSubId() {
			return (i++).toString();
		}
		expect(
			initialToPatches(
				{
					foo: {
						bar: 'baz',
					},
					qux: [
						{
							corge: 'grault',
						},
						{
							bin: {
								oof: 1,
							},
						},
					],
				},
				'test/a',
				createSubId,
			),
		).toMatchInlineSnapshot();
	});
});

describe('adding oids to all sub-level objects', () => {
	it('should add oids to all kinds of sub-objects', () => {
		let i = 0;
		function createSubId() {
			return (i++).toString();
		}

		const result = addOidsAtAllLevels(
			addOid(
				{
					foo: {
						bar: 1,
					},
					baz: [
						{
							qux: 2,
						},
						{
							corge: [],
						},
					],
				},
				'test/a',
			),
			createSubId,
		);
		expect(result).toMatchInlineSnapshot(`
			{
			  "@@oid": "test/a",
			  "baz": [
			    {
			      "@@oid": "test/a:2",
			      "qux": 2,
			    },
			    {
			      "@@oid": "test/a:3",
			      "corge": [],
			    },
			  ],
			  "foo": {
			    "@@oid": "test/a:0",
			    "bar": 1,
			  },
			}
		`);
		// snapshot doesn't capture the oid assigned to the array directly
		expect(result.baz['@@oid']).toBe('test/a:1');
	});
});
