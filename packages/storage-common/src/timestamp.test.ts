import { describe, expect, it } from 'vitest';
import { HybridLogicalClockTimestampProvider } from './timestamp.js';

describe('the hybrid logical clock', () => {
	it('always produces incrementing timestamps', () => {
		const clock = new HybridLogicalClockTimestampProvider();
		let prev = clock.now();
		clock.update(prev);
		let now;
		for (let i = 0; i < 100; i++) {
			now = clock.now();
			expect(now > prev, `${now} not later than ${prev}`).toBe(true);
			clock.update(now);
			prev = now;
		}
	});
});
