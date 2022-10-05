import { describe, expect, it } from 'vitest';
import { assignOid, assignOidsToAllSubObjects, getOid } from './oids.js';
import {
	applyPatches,
	diffToPatches,
	initialToPatches,
	substituteRefsWithObjects,
} from './operation.js';

function createClock() {
	let i = 0;
	return () => (i++).toString();
}

describe('creating diff patch operations', () => {
	describe('on flat objects', () => {
		it('generates and applies set and remove operations', () => {
			const from = { foo: 'bar', baz: 'qux', zing: 1 };
			assignOid(from, 'test/a');
			const to = { foo: 'bar', baz: 'pop' };
			assignOid(to, 'test/a');
			const patches = diffToPatches(from, to, createClock());
			expect(patches).toEqual([
				{
					oid: 'test/a',
					op: 'set',
					name: 'baz',
					value: 'pop',
					timestamp: '0',
				},
				{
					oid: 'test/a',
					op: 'remove',
					name: 'zing',
					timestamp: '1',
				},
			]);
			const result = applyPatches(from, patches);
			expect(result).toEqual(to);
		});
	});
	describe('on nested objects', () => {
		it('replaces whole nested objects', () => {
			const from = assignOid(
				{
					foo: 'bar',
					baz: assignOid({ qux: 'corge' }, 'test/a:0'),
				},
				'test/a',
			);
			const to = assignOid(
				{
					foo: 'bar',
					baz: assignOid({ qux: 'grault' }, 'test/a:1'),
				},
				'test/a',
			);
			const patches = diffToPatches(from, to, createClock());
			expect(patches).toEqual([
				{
					oid: 'test/a:1',
					op: 'initialize',
					value: {
						qux: 'grault',
					},
					timestamp: '0',
				},
				{
					oid: 'test/a',
					op: 'set',
					name: 'baz',
					value: {
						'@@type': 'ref',
						id: 'test/a:1',
					},
					timestamp: '1',
				},
			]);
		});
		it('replaces whole nested objects with different ids even if fields are the same', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge' },
			};
			assignOid(from, 'test/a');
			assignOid(from.baz, 'test/a:0');
			const to = {
				foo: 'bar',
				baz: { qux: 'corge' },
			};
			assignOid(to, 'test/a');
			assignOid(to.baz, 'test/a:1');
			const patches = diffToPatches(from, to, createClock());
			expect(patches).toMatchInlineSnapshot(`
				[
				  {
				    "oid": "test/a:1",
				    "op": "initialize",
				    "timestamp": "0",
				    "value": {
				      "qux": "corge",
				    },
				  },
				  {
				    "name": "baz",
				    "oid": "test/a",
				    "op": "set",
				    "timestamp": "1",
				    "value": {
				      "@@type": "ref",
				      "id": "test/a:1",
				    },
				  },
				]
			`);
		});
		it('does not replace objects with the same identity and same fields', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge' },
			};
			assignOid(from, 'test/a');
			assignOid(from.baz, 'test/a:0');
			const to = {
				foo: 'bar',
				baz: { qux: 'corge' },
			};
			assignOid(to, 'test/a');
			assignOid(to.baz, 'test/a:0');
			const patches = diffToPatches(from, to, createClock());
			expect(patches).toEqual([]);
		});
		it('patches sub-objects with same identity', () => {
			const from = {
				foo: 'bar',
				baz: { qux: 'corge' },
			};
			assignOid(from, 'test/a');
			assignOid(from.baz, 'test/a:0');
			const to = {
				foo: 'bar',
				baz: { qux: 'fig' },
			};
			assignOid(to, 'test/a');
			assignOid(to.baz, 'test/a:0');
			const patches = diffToPatches(from, to, createClock());
			expect(patches).toEqual([
				{
					oid: 'test/a:0',
					op: 'set',
					name: 'qux',
					value: 'fig',
					timestamp: '0',
				},
			]);
		});
	});
	describe('on lists of primitives', () => {
		it('pushes items', async () => {
			expect(
				applyPatches(assignOid(['foo', 'bar'], 'test/a'), [
					{
						oid: 'test/a',
						op: 'list-push',
						value: 'baz',
						timestamp: '0',
					},
				]),
			).toEqual(['foo', 'bar', 'baz']);
		});
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
	it('should work for complex nested arrays and objects', () => {
		const from = {
			foo: {
				bar: [1, 2, 3],
			},
			baz: [
				{
					corge: true,
				},
			],
		};
		assignOid(from, 'test/a');
		assignOid(from.foo, 'test/a:1');
		assignOid(from.foo.bar, 'test/a:2');
		assignOid(from.baz, 'test/a:3');
		assignOid(from.baz[0], 'test/a:4');

		const to = {
			foo: {
				bar: [1, 2],
				bop: [0],
			},
			baz: [
				{
					corge: false,
				},
				{
					corge: false,
				},
			],
		};
		assignOid(to, 'test/a');
		assignOid(to.foo, 'test/a:1');
		assignOid(to.foo.bar, 'test/a:2');
		assignOid(to.foo.bop, 'test/a:6');
		assignOid(to.baz, 'test/a:3');
		assignOid(to.baz[0], 'test/a:4');
		assignOid(to.baz[1], 'test/a:5');
		expect(diffToPatches(from, to, createClock())).toMatchInlineSnapshot(`
			[
			  {
			    "count": 1,
			    "index": 2,
			    "oid": "test/a:2",
			    "op": "list-delete",
			    "timestamp": "0",
			  },
			  {
			    "oid": "test/a:6",
			    "op": "initialize",
			    "timestamp": "1",
			    "value": [
			      0,
			    ],
			  },
			  {
			    "name": "bop",
			    "oid": "test/a:1",
			    "op": "set",
			    "timestamp": "2",
			    "value": {
			      "@@type": "ref",
			      "id": "test/a:6",
			    },
			  },
			  {
			    "name": "corge",
			    "oid": "test/a:4",
			    "op": "set",
			    "timestamp": "3",
			    "value": false,
			  },
			  {
			    "oid": "test/a:5",
			    "op": "initialize",
			    "timestamp": "4",
			    "value": {
			      "corge": false,
			    },
			  },
			  {
			    "name": 1,
			    "oid": "test/a:3",
			    "op": "set",
			    "timestamp": "5",
			    "value": {
			      "@@type": "ref",
			      "id": "test/a:5",
			    },
			  },
			]
		`);
	});
});

describe('substituting refs with objects', () => {
	it('does nothing when no refs exist', () => {
		const root = {
			foo: 'bar',
		};
		assignOid(root, 'test/a');
		const substituted = substituteRefsWithObjects(root, new Map());
		expect(root).toEqual({
			foo: 'bar',
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
		};
		assignOid(root, 'test/1');

		const substituted = substituteRefsWithObjects(
			root,
			new Map([['test/1:a', { foo: 'bar' }]]),
		);
		expect(root).toEqual({
			foo: {
				foo: 'bar',
			},
			qux: 1,
		});
		expect(substituted).toEqual(['test/1:a']);
		expect(getOid(root)).toEqual('test/1');
		expect(getOid(root.foo)).toEqual('test/1:a');
	});

	it('inserts nested objects with oids', () => {
		const root: any = {
			foo: {
				'@@type': 'ref',
				id: 'test/1:a',
			},
		};
		assignOid(root, 'test/1');
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
				},
			},
		});
		expect(substituted).toEqual(['test/1:a', 'test/1:b']);
		expect(getOid(root)).toEqual('test/1');
		expect(getOid(root.foo)).toEqual('test/1:a');
		expect(getOid(root.foo.baz)).toEqual('test/1:b');
	});

	it('substitutes arrays of objects', () => {
		const root: any = {
			foo: {
				'@@type': 'ref',
				id: 'test/1:c',
			},
		};
		assignOid(root, 'test/1');

		const substituted = substituteRefsWithObjects(
			root,
			new Map([
				[
					'test/1:c',
					[
						{
							'@@type': 'ref',
							id: 'test/1:a',
						},
						{
							'@@type': 'ref',
							id: 'test/1:b',
						},
					],
				],
				[
					'test/1:a',
					{
						foo: 'bar',
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
			foo: [
				{
					foo: 'bar',
				},
				{
					qux: 'corge',
				},
			],
		});
		expect(substituted).toEqual(['test/1:c', 'test/1:a', 'test/1:b']);
		expect(getOid(root)).toEqual('test/1');
		expect(getOid(root.foo)).toEqual('test/1:c');
		expect(getOid(root.foo[0])).toEqual('test/1:a');
		expect(getOid(root.foo[1])).toEqual('test/1:b');
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
				createClock(),
				createSubId,
			),
		).toMatchInlineSnapshot(`
			[
			  {
			    "oid": "test/a",
			    "op": "initialize",
			    "timestamp": "0",
			    "value": {
			      "foo": {
			        "@@type": "ref",
			        "id": "test/a:0",
			      },
			      "qux": {
			        "@@type": "ref",
			        "id": "test/a:1",
			      },
			    },
			  },
			  {
			    "oid": "test/a:0",
			    "op": "initialize",
			    "timestamp": "1",
			    "value": {
			      "bar": "baz",
			    },
			  },
			  {
			    "oid": "test/a:1",
			    "op": "initialize",
			    "timestamp": "2",
			    "value": [
			      {
			        "@@type": "ref",
			        "id": "test/a:2",
			      },
			      {
			        "@@type": "ref",
			        "id": "test/a:3",
			      },
			    ],
			  },
			  {
			    "oid": "test/a:2",
			    "op": "initialize",
			    "timestamp": "3",
			    "value": {
			      "corge": "grault",
			    },
			  },
			  {
			    "oid": "test/a:3",
			    "op": "initialize",
			    "timestamp": "4",
			    "value": {
			      "bin": {
			        "@@type": "ref",
			        "id": "test/a:4",
			      },
			    },
			  },
			  {
			    "oid": "test/a:4",
			    "op": "initialize",
			    "timestamp": "5",
			    "value": {
			      "oof": 1,
			    },
			  },
			]
		`);
	});
});
