import { ClientMessage, ServerMessage } from '@aglio/storage-common';

export interface Sync {
	subscribe(handler: (message: ServerMessage) => void): () => void;

	send(message: ClientMessage): void;
}

/**
 * Basically a no-op sync.
 */
export class LocalSync implements Sync {
	subscribe = () => () => {};
	send = () => {};
}
