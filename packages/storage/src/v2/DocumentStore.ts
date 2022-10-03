import {
	createOid,
	decomposeOid,
	getOid,
	ObjectIdentifier,
	ObjectWithIdentifier,
} from '@aglio/storage-common';
import cuid from 'cuid';
import { storeRequestPromise } from '../idb.js';
import { createDocument, Document, updateLiveObject } from './Document.js';
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
		updateLiveObject(doc, result);
	};

	take = (source: ObjectWithIdentifier) => {
		const oid = getOid(source);
		const { collection, id } = decomposeOid(oid);

		let doc = this.cache.get(oid);
		if (!doc) {
			doc = createDocument(
				{
					applyOperation: async (op) =>
						this.meta.insertLocalOperation(
							await this.meta.messageCreator.createOperation({
								patches: op.patches,
								rootOid: oid,
							}),
						),
					createObject: () => createOid(collection, id, cuid().slice(0, 7)),
				},
				source,
			);
			this.cache.set(oid, doc);
		}

		updateLiveObject(doc, source);

		return doc;
	};

	dispose = (oid: ObjectIdentifier) => {
		const doc = this.cache.get(oid);
		if (!doc) {
			return;
		}
		doc.dispose();
		this.cache.delete(oid);
	};
}
