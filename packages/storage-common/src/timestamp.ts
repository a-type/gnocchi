import { v4 } from 'uuid';

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
	private clock = {
		timestamp: MutableTimestamp.from(0, 0),
	};

	now = () => {
		return Timestamp.send(this.clock).toString();
	};
	update = (remoteTimestamp: string) => {
		const remote = Timestamp.parse(remoteTimestamp);
		if (!remote) {
			throw new Error('Invalid remote timestamp: ' + remoteTimestamp);
		}
		Timestamp.recv(this.clock, remote);
	};
}

class DuplicateNodeError extends Error {
	type: string;
	constructor(node: string) {
		super();
		this.type = 'DuplicateNodeError';
		this.message = 'duplicate node identifier ' + node;
	}
}

class ClockDriftError extends Error {
	type: string;
	constructor(...args: any[]) {
		super();
		this.type = 'ClockDriftError';
		this.message = ['maximum clock drift exceeded'].concat(args).join(' ');
	}
}

class OverflowError extends Error {
	type: string;
	constructor() {
		super();
		this.type = 'OverflowError';
		this.message = 'timestamp counter overflow';
	}
}

var config = {
	// Maximum physical clock drift allowed, in ms
	maxDrift: 60000,
};

// James Long's HLC implementation.
// I respect him for building a great foundation but the API design
// is wild lol.
class Timestamp {
	_state: {
		millis: number;
		counter: number;
		node: string;
	};

	constructor(millis: number, counter: number, node?: string) {
		this._state = {
			millis: millis,
			counter: counter,
			node: node || v4().replace(/-/g, '').slice(-16),
		};
	}

	valueOf() {
		return this.toString();
	}

	toString() {
		return [
			new Date(this.millis()).toISOString(),
			('0000' + this.counter().toString(16).toUpperCase()).slice(-4),
			('0000000000000000' + this.node()).slice(-16),
		].join('-');
	}

	millis() {
		return this._state.millis;
	}

	counter() {
		return this._state.counter;
	}

	node() {
		return this._state.node;
	}

	// Timestamp generator initialization
	// * sets the node ID to an arbitrary value
	// * useful for mocking/unit testing
	static init = function (options: { maxDrift?: number } = {}) {
		if (options.maxDrift) {
			config.maxDrift = options.maxDrift;
		}
	};

	/**
	 * Timestamp send. Generates a unique, monotonic timestamp suitable
	 * for transmission to another system in string format
	 */
	static send = (clock: { timestamp: MutableTimestamp }) => {
		// Retrieve the local wall time
		var phys = Date.now();

		// Unpack the clock.timestamp logical time and counter
		var lOld = clock.timestamp.millis();
		var cOld = clock.timestamp.counter();

		// Calculate the next logical time and counter
		// * ensure that the logical time never goes backward
		// * increment the counter if phys time does not advance
		var lNew = Math.max(lOld, phys);
		var cNew = lOld === lNew ? cOld + 1 : 0;

		// Check the result for drift and counter overflow
		if (lNew - phys > config.maxDrift) {
			throw new ClockDriftError(lNew, phys, config.maxDrift);
		}
		if (cNew > 65535) {
			throw new OverflowError();
		}

		// Repack the logical time/counter
		clock.timestamp.setMillis(lNew);
		clock.timestamp.setCounter(cNew);

		return new Timestamp(
			clock.timestamp.millis(),
			clock.timestamp.counter(),
			clock.timestamp.node(),
		);
	};

	// Timestamp receive. Parses and merges a timestamp from a remote
	// system with the local timeglobal uniqueness and monotonicity are
	// preserved
	static recv = function (
		clock: { timestamp: MutableTimestamp },
		msg: Timestamp,
	) {
		var phys = Date.now();

		// Unpack the message wall time/counter
		var lMsg = msg.millis();
		var cMsg = msg.counter();

		// Assert the node id and remote clock drift
		// if (msg.node() === clock.timestamp.node()) {
		// 	throw new DuplicateNodeError(clock.timestamp.node());
		// }
		if (lMsg - phys > config.maxDrift) {
			throw new ClockDriftError();
		}

		// Unpack the clock.timestamp logical time and counter
		var lOld = clock.timestamp.millis();
		var cOld = clock.timestamp.counter();

		// Calculate the next logical time and counter.
		// Ensure that the logical time never goes backward;
		// * if all logical clocks are equal, increment the max counter,
		// * if max = old > message, increment local counter,
		// * if max = messsage > old, increment message counter,
		// * otherwise, clocks are monotonic, reset counter
		var lNew = Math.max(Math.max(lOld, phys), lMsg);
		var cNew =
			lNew === lOld && lNew === lMsg
				? Math.max(cOld, cMsg) + 1
				: lNew === lOld
				? cOld + 1
				: lNew === lMsg
				? cMsg + 1
				: 0;

		// Check the result for drift and counter overflow
		if (lNew - phys > config.maxDrift) {
			throw new ClockDriftError();
		}
		if (cNew > 65535) {
			throw new OverflowError();
		}

		// Repack the logical time/counter
		clock.timestamp.setMillis(lNew);
		clock.timestamp.setCounter(cNew);

		return new Timestamp(
			clock.timestamp.millis(),
			clock.timestamp.counter(),
			clock.timestamp.node(),
		);
	};

	static parse = function (timestamp: string) {
		if (typeof timestamp === 'string') {
			var parts = timestamp.split('-');
			if (parts && parts.length === 5) {
				var millis = Date.parse(parts.slice(0, 3).join('-')).valueOf();
				var counter = parseInt(parts[3], 16);
				var node = parts[4];
				if (!isNaN(millis) && !isNaN(counter))
					return new Timestamp(millis, counter, node);
			}
		}
		return null;
	};

	static since = (isoString: string) => {
		return isoString + '-0000-0000000000000000';
	};
}

class MutableTimestamp extends Timestamp {
	setMillis(n: number) {
		this._state.millis = n;
	}

	setCounter(n: number) {
		this._state.counter = n;
	}

	setNode(n: string) {
		this._state.node = n;
	}

	static from = (millis: number, counter: number) => {
		return new MutableTimestamp(millis, counter);
	};
}
