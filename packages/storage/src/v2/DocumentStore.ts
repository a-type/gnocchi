import {
	decomposeOid,
	getOid,
	ObjectIdentifier,
	ObjectWithIdentifier,
} from '@aglio/storage-common';
import { storeRequestPromise } from '../idb.js';
import { Document, UPDATE } from './Document.js';
import { Metadata } from './Metadata.js';

export class DocumentStore {
	private cache = new Map<string, Document<any>>();

	constructor(
		private readonly db: IDBDatabase,
		private readonly meta: Metadata,
	) {}

	refresh = async (oid: ObjectIdentifier) => {
		if (!this.cache.has(oid)) {
			return;
		}

		const { collection, id } = decomposeOid(oid);
		const store = this.db
			.transaction(collection, 'readwrite')
			.objectStore(collection);
		const request = store.get(id);
		const result = await storeRequestPromise(request);

		const doc = this.cache.get(oid)!;
		doc[UPDATE](result);
	};

	take = (source: ObjectWithIdentifier) => {
		const oid = getOid(source);

		let doc = this.cache.get(oid);
		if (!doc) {
			doc = new Document();
			this.cache.set(oid, doc);
		}

		doc[UPDATE](source);

		return doc;
	};

	dispose = (oid: ObjectIdentifier) => {
		this.cache.delete(oid);
	};
}
