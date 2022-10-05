import { describe, expect, it } from 'vitest';
import {
	assignOid,
	assignOidsToAllSubObjects,
	getOidRange,
	normalize,
	ObjectIdentifier,
} from './oids.js';

describe('normalizing an object', () => {
	it('should return a map of sub-objects with relationships replaced by refs', () => {
		let i = 0;
		function createSubId() {
			return (i++).toString();
		}

		const initial = {
			foo: {
				bar: 1,
				baz: [2, 3],
			},
			qux: [
				{
					corge: true,
				},
				{
					grault: {
						garply: 4,
					},
				},
			],
		};
		assignOid(initial, 'test/a');
		assignOidsToAllSubObjects(initial, createSubId);

		const result = normalize(initial);

		expect(result.get('test/a')).toEqual({
			foo: {
				'@@type': 'ref',
				id: 'test/a:0',
			},
			qux: {
				'@@type': 'ref',
				id: 'test/a:2',
			},
		});
		expect(result.get('test/a:0')).toEqual({
			bar: 1,
			baz: {
				'@@type': 'ref',
				id: 'test/a:1',
			},
		});
		expect(result.get('test/a:1')).toEqual([2, 3]);
		expect(result.get('test/a:2')).toEqual([
			{
				'@@type': 'ref',
				id: 'test/a:3',
			},
			{
				'@@type': 'ref',
				id: 'test/a:4',
			},
		]);
		expect(result.get('test/a:3')).toEqual({
			corge: true,
		});
		expect(result.get('test/a:4')).toEqual({
			grault: {
				'@@type': 'ref',
				id: 'test/a:5',
			},
		});
		expect(result.get('test/a:5')).toEqual({
			garply: 4,
		});
	});
});

describe('computing a range of oids for a whole object set', () => {
	function isWithin(
		oid: ObjectIdentifier,
		start: ObjectIdentifier,
		end: ObjectIdentifier,
	) {
		return oid >= start && oid <= end;
	}
	it('should include the root object and any possible sub object oid', () => {
		const [start, end] = getOidRange('test/a');
		expect(start).toEqual('test/a');
		expect(end).toEqual('test/a:\uffff');
		expect(start < end).toBe(true);
		expect(isWithin('test/a', start, end)).toBe(true);
		expect(isWithin('test/a:0', start, end)).toBe(true);
		expect(isWithin('test/a:1', start, end)).toBe(true);
		expect(isWithin('test/a:zzzzzzzzzzzzzzzzzzzzzzz', start, end)).toBe(true);
		expect(isWithin('test/a:\uffff', start, end)).toBe(true);
		expect(isWithin('test1/a', start, end)).toBe(false);
		expect(isWithin('test/b', start, end)).toBe(false);
		expect(isWithin('test/ ', start, end)).toBe(false);
	});
});
