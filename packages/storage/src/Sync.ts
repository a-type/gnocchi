import {
	ClientMessage,
	HybridLogicalClockTimestampProvider,
	ServerMessage,
	TimestampProvider,
} from '@aglio/storage-common';
import { EventSubscriber } from './EventSubscriber.js';

export interface Sync {
	subscribe(handler: (message: ServerMessage) => void): () => void;

	send(message: ClientMessage): void;

	readonly time: TimestampProvider;
}

/**
 * Basically a no-op sync.
 */
export class LocalSync implements Sync {
	constructor(readonly time: TimestampProvider) {}

	subscribe = () => () => {};
	send = () => {};
}

export class WebsocketSync implements Sync {
	readonly time: TimestampProvider;
	private socket: WebSocket;
	private events = new EventSubscriber<{
		message: (msg: ServerMessage) => void;
	}>();
	private messageQueue: ClientMessage[] = [];

	constructor({
		host,
		time: timestampProvider,
	}: {
		host: string;
		time?: TimestampProvider;
	}) {
		this.time = timestampProvider || new HybridLogicalClockTimestampProvider();
		this.socket = new WebSocket(host);
		this.socket.addEventListener('message', this.onMessage);
		this.socket.addEventListener('open', this.onOpen);
		// TODO: reconnection
	}

	private onOpen = () => {
		if (this.messageQueue.length) {
			this.messageQueue.forEach((msg) => this.socket.send(JSON.stringify(msg)));
			this.messageQueue = [];
		}

		setInterval(() => {
			this.send({
				type: 'heartbeat',
				timestamp: this.time.now(),
			});
		}, 60000);
	};

	private onMessage = (event: MessageEvent) => {
		const message = JSON.parse(event.data) as ServerMessage;
		if ((message as any).timestamp) {
			this.time.update((message as any).timestamp);
		}
		this.events.emit('message', message);
	};

	subscribe = (handler: (message: ServerMessage) => void) => {
		return this.events.subscribe('message', handler);
	};

	send = (message: ClientMessage) => {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(message));
		} else {
			this.messageQueue.push(message);
		}
	};
}

export interface HybridSyncOptions {
	host: string;
	timestampProvider?: TimestampProvider;
}

export class HybridSync implements Sync {
	readonly time: TimestampProvider;
	private host: string;
	private active: Sync;
	private events = new EventSubscriber<{
		message: (msg: ServerMessage) => void;
		networkChange: (isOnline: boolean) => void;
	}>();
	private unsubscribeActive: () => void;

	constructor({ host, timestampProvider }: HybridSyncOptions) {
		this.time = timestampProvider || new HybridLogicalClockTimestampProvider();
		this.host = host;
		this.active = new LocalSync(this.time);
		this.unsubscribeActive = this.active.subscribe(this.onMessage);
	}

	private onMessage = (message: ServerMessage) => {
		this.events.emit('message', message);
	};

	goOnline = () => {
		if (this.active instanceof WebsocketSync) return;
		this.active = new WebsocketSync({
			host: this.host,
			time: this.time,
		});
		this.unsubscribeActive();
		this.unsubscribeActive = this.active.subscribe(this.onMessage);
		this.events.emit('networkChange', true);
	};

	goOffline = () => {
		if (this.active instanceof LocalSync) return;
		this.active = new LocalSync(this.time);
		this.unsubscribeActive();
		this.unsubscribeActive = this.active.subscribe(this.onMessage);
		this.events.emit('networkChange', false);
	};

	subscribe = (handler: (message: ServerMessage) => void) => {
		return this.events.subscribe('message', handler);
	};

	subscribeToNetworkChange = (handler: (isOnline: boolean) => void) => {
		return this.events.subscribe('networkChange', handler);
	};

	send = (message: ClientMessage) => {
		this.active.send(message);
	};
}
