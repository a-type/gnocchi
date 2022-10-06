import {
	ClientMessage,
	ObjectIdentifier,
	ServerMessage,
} from '@aglio/storage-common';
import { EventSubscriber } from '../EventSubscriber.js';
import type { Sync } from '../Sync.js';
import { EntityStore } from './EntityStore.js';
import { Metadata } from './Metadata.js';

/**
  Bridges sync messages and the local storage, interpreting messages and
  handling initial sync and heartbeat.
 */
export class SyncHarness {
	private sync;
	private meta;
	private initialPresence: any;
	private heartbeat;
	private entities;

	constructor({
		sync,
		meta,
		initialPresence,
		entities,
	}: {
		sync: Sync;
		meta: Metadata;
		entities: EntityStore;
		initialPresence: any;
	}) {
		this.sync = sync;
		this.meta = meta;
		this.initialPresence = initialPresence;
		this.entities = entities;
		this.heartbeat = new Heartbeat({
			sync: this.sync,
			meta: this.meta,
		});
		sync.subscribe('onlineChange', this.handleOnlineChange);
		sync.subscribe('message', this.handleMessage);
	}

	private handleOnlineChange = async (online: boolean) => {
		if (!online) {
			this.heartbeat.stop();
		} else {
			this.sync.send(await this.meta.messageCreator.createSyncStep1());
			this.sync.send(
				await this.meta.messageCreator.createPresenceUpdate(
					this.initialPresence,
				),
			);
			this.heartbeat.start();
		}
	};

	private handleMessage = async (message: ServerMessage) => {
		let affectedOids: ObjectIdentifier[] = [];
		switch (message.type) {
			case 'op-re':
				// rebroadcasted operations
				affectedOids = await this.meta.insertRemoteOperations(message.ops);
				break;
			case 'sync-resp':
				await this.meta.ackInfo.setGlobalAck(message.globalAckTimestamp);

				// respond to the server
				this.sync.send(
					await this.meta.messageCreator.createSyncStep2(
						message.provideChangesSince,
					),
				);
				await this.meta.updateLastSynced();
				break;
			case 'rebases':
				for (const rebase of message.rebases) {
					await this.meta.rebase(rebase.oid, rebase.upTo);
					affectedOids.push(rebase.oid);
				}
				break;
		}

		for (const oid of affectedOids) {
			this.entities.refresh(oid);
		}
	};

	send = async (message: ClientMessage) => {
		this.sync.send(message);
	};
}

export class Heartbeat extends EventSubscriber<{
	missed: () => void;
}> {
	private sync: Sync;
	private meta: Metadata;
	private interval: number;
	private deadlineLength: number;
	private nextBeat: NodeJS.Timeout | null = null;
	private deadline: NodeJS.Timeout | null = null;

	constructor({
		sync,
		meta,
		interval = 15 * 1000,
		deadlineLength = 3 * 1000,
	}: {
		sync: Sync;
		meta: Metadata;
		interval?: number;
		deadlineLength?: number;
	}) {
		super();
		this.sync = sync;
		this.meta = meta;
		this.interval = interval;
		this.deadlineLength = deadlineLength;
		sync.subscribe('message', this.handleSyncMessage);
	}

	private handleSyncMessage = (message: ServerMessage) => {
		if (message.type === 'heartbeat-response') {
			if (this.deadline) {
				clearTimeout(this.deadline);
				this.deadline = null;
				this.start();
			}
		}
	};

	start = () => {
		this.nextBeat = setTimeout(this.beat, this.interval);
	};

	stop = () => {
		if (this.nextBeat) {
			clearTimeout(this.nextBeat);
		}
		if (this.deadline) {
			clearTimeout(this.deadline);
		}
	};

	private beat = async () => {
		this.sync.send(await this.meta.messageCreator.createHeartbeat());
		this.deadline = setTimeout(this.onDeadline, this.deadlineLength);
	};

	private onDeadline = () => {
		this.deadline = null;
		this.emit('missed');
	};
}
