import HLC from '@consento/hlc';
import bigintTime from 'bigint-time';

export interface TimestampProvider {
	now(): string;
	update(remoteTimestamp: string): void;
}

export class NaiveTimestampProvider implements TimestampProvider {
	now = () => {
		return Date.now().toString();
	};
	update = () => {};
}

export class HybridLogicalClockTimestampProvider implements TimestampProvider {
	private clock = new HLC({
		wallTime: bigintTime,
		maxOffset: 0,
		toleratedForwardClockJump: 0,
		wallTimeUpperBound: 0,
		last: undefined,
	});
	private textEncoder = new TextEncoder();
	private textDecoder = new TextDecoder();

	now = () => {
		const encoded = HLC.codec.encode(this.clock.now());
		return this.textDecoder.decode(encoded);
	};
	update = (remoteTimestamp: string) => {
		const decoded = this.textEncoder.encode(remoteTimestamp);
		const remote = HLC.codec.decode(decoded);
		this.clock.update(remote);
	};
}
