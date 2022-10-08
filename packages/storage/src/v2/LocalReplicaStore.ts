import cuid from 'cuid';
import { storeRequestPromise } from './idb.js';

type LocalReplicaInfo = {
	type: 'localReplicaInfo';
	id: string;
	ackedLogicalTime: string | null;
	lastSyncedLogicalTime: string | null;
};

export class LocalReplicaStore {
	private cached: LocalReplicaInfo | undefined;

	constructor(private readonly db: IDBDatabase) {}

	get = async () => {
		if (this.cached) {
			return this.cached;
		}

		const db = this.db;
		const transaction = db.transaction('info', 'readonly');
		const store = transaction.objectStore('info');

		const request = store.get('localReplicaInfo');
		const lookup = await storeRequestPromise(request);

		if (!lookup) {
			// create our own replica info now
			const replicaId = cuid();
			const replicaInfo: LocalReplicaInfo = {
				type: 'localReplicaInfo',
				id: replicaId,
				ackedLogicalTime: null,
				lastSyncedLogicalTime: null,
			};
			const transaction = db.transaction('info', 'readwrite');
			const store = transaction.objectStore('info');
			const request = store.add(replicaInfo);
			await storeRequestPromise(request);
			this.cached = replicaInfo;
			return replicaInfo;
		}

		this.cached = lookup;
		return lookup;
	};

	update = async (data: Partial<LocalReplicaInfo>) => {
		const localReplicaInfo = await this.get();
		Object.assign(localReplicaInfo, data);
		const db = await this.db;
		const transaction = db.transaction('info', 'readwrite');
		const store = transaction.objectStore('info');
		const request = store.put(localReplicaInfo);
		await storeRequestPromise(request);
		this.cached = localReplicaInfo;
	};
}
