import { BasePresence, ServerMessage, UserInfo } from '@aglio/storage-common';
import { EventSubscriber } from './EventSubscriber.js';
import { Meta } from './Meta.js';
import { Sync } from './Sync.js';

export class PresenceManager<
	Profile,
	Presence extends BasePresence,
> extends EventSubscriber<{
	peerChanged: (userId: string, presence: any) => void;
	selfChanged: (presence: any) => void;
	peersChanged: (peers: Record<string, any>) => void;
}> {
	private _peers = {} as Record<string, UserInfo<Profile, Presence>>;
	private _self = { profile: {} } as UserInfo<Profile, Presence>;
	private _peerIds = new Array<string>();

	get self() {
		return this._self;
	}

	get peers() {
		return this._peers;
	}

	get peerIds() {
		return this._peerIds;
	}

	constructor(private sync: Sync, private meta: Meta) {
		super();
		this.sync.subscribe('message', this.onMessage);
	}

	private onMessage = async (message: ServerMessage) => {
		const localReplicaInfo = await this.meta.getLocalReplicaInfo();

		let peersChanged = false;
		const peerIdsSet = new Set<string>(this.peerIds);

		if (message.type === 'presence-changed') {
			if (message.replicaId === localReplicaInfo.id) {
				this._self = message.userInfo;
				this.emit('selfChanged', message.userInfo);
			} else {
				peerIdsSet.add(message.userInfo.id);
				this._peers[message.userInfo.id] = message.userInfo;
				peersChanged = true;
			}
		} else if (message.type === 'sync-resp') {
			for (const [id, presence] of Object.entries(message.peerPresence)) {
				if (presence.replicaId === localReplicaInfo.id) {
					this._self = presence;
					this.emit('selfChanged', presence);
				} else {
					peersChanged = true;
					peerIdsSet.add(id);
					this._peers[id] = presence;
					this.emit('peerChanged', id, presence);
				}
			}
			if (peersChanged) {
				this._peerIds = Array.from(peerIdsSet);
				this.emit('peersChanged', this._peers);
			}
		}
	};

	setPresence = (replicaId: string, presence: Presence) => {
		this.sync.send({
			type: 'presence-update',
			presence,
			replicaId,
		});
	};
}
