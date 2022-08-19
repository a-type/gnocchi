import {
	ClientMessage,
	ServerMessage,
	TimestampProvider,
} from '@aglio/storage-common';

export interface Sync {
	subscribe(handler: (message: ServerMessage) => void): () => void;

	send(message: ClientMessage): void;

	/** Gets a timestamp */
	now(): string;
}

/**
 * Basically a no-op sync.
 */
export class LocalSync implements Sync {
	constructor(private time: TimestampProvider) {}

	subscribe = () => () => {};
	send = () => {};
	now = () => this.time.now();
}
