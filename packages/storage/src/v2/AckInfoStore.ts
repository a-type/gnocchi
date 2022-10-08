import { storeRequestPromise } from './idb.js';

type AckInfo = {
	type: 'ack';
	// null means no operations are acknowledged
	// by every peer yet.
	globalAckTimestamp: string | null;
};

export class AckInfoStore {
	constructor(private readonly db: IDBDatabase) {}

	getAckInfo = async (): Promise<AckInfo> => {
		const db = this.db;
		const transaction = db.transaction('info', 'readonly');
		const store = transaction.objectStore('info');
		const request = store.get('ack');
		const result = await storeRequestPromise<AckInfo>(request);
		if (result) {
			return result;
		} else {
			return {
				globalAckTimestamp: null,
				type: 'ack',
			};
		}
	};

	setGlobalAck = async (ack: string) => {
		const ackInfo = await this.getAckInfo();
		const db = this.db;
		const transaction = db.transaction('info', 'readwrite');
		const store = transaction.objectStore('info');
		const request = store.put({
			...ackInfo,
			globalAckTimestamp: ack,
		});
	};
}
