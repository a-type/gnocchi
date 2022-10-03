import {
	createOid,
	decomposeOid,
	getOid,
	ObjectIdentifier,
	ObjectWithIdentifier,
	OperationPatch,
	StorageDocument,
	SyncOperation,
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

	/**
	 * If a document exists in the cache, it will
	 * be refreshed with the current database state.
	 */
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
		return doc;
	};

	/**
	 * Stores the document in the database. Does
	 * not update the cache.
	 */
	store = async (view: ObjectWithIdentifier) => {
		const oid = getOid(view);
		const { collection, id } = decomposeOid(oid);
		const store = this.db
			.transaction(collection, 'readwrite')
			.objectStore(collection);
		await storeRequestPromise(store.put(view));
		// TODO: do this more efficiently
		this.refresh(oid);
	};

	/**
	 * Stores the view in the database and returns a
	 * live document object.
	 */
	put = async (view: ObjectWithIdentifier) => {
		await this.store(view);
		return this.take(view);
	};

	/**
	 * Get a cached live document for the given
	 * view. If the document is not in the cache,
	 * it will be created and cached.
	 *
	 * TODO: kill this. docs should not be added
	 * to cache until subscribed
	 */
	take = (source: ObjectWithIdentifier) => {
		const oid = getOid(source);

		let doc = this.cache.get(oid);
		if (!doc) {
			doc = this.wrap(source);
			this.cache.set(oid, doc);
		}

		updateLiveObject(doc, source);

		return doc;
	};

	wrap = (source: ObjectWithIdentifier) => {
		const oid = getOid(source);
		if (this.cache.has(oid)) {
			return this.cache.get(oid)!;
		}
		const { collection, id } = decomposeOid(oid);
		return createDocument(
			{
				applyOperation: async (op) =>
					this.applyLocalOperation(
						await this.meta.messageCreator.createOperation({
							patches: op.patches,
							rootOid: oid,
						}),
					),
				createObject: () => createOid(collection, id, cuid().slice(0, 7)),
			},
			this.events,
			source,
		);
	};

	dispose = (oid: ObjectIdentifier) => {
		const doc = this.cache.get(oid);
		if (!doc) {
			return;
		}
		doc.dispose();
		this.cache.delete(oid);
	};

	applyLocalOperation = async (
		op: SyncOperation,
	): Promise<Document<any> | null> => {
		await this.meta.insertLocalOperation(op);
		const view = await this.meta.getComputedView(op.rootOid);
		if (!view) {
			return null;
		}
		this.store(view);
		return this.wrap(view);
	};

	applyRemoteOperations = async (ops: SyncOperation[]) => {
		const affectedOids = await this.meta.insertRemoteOperations(ops);
		for (const oid of affectedOids) {
			const view = await this.meta.getComputedView(oid);
			if (!view) {
				continue;
			}
			this.store(view);
		}
	};

	events = {
		onSubscribed: (oid: ObjectIdentifier) => {},
		onAllUnsubscribed: (oid: ObjectIdentifier) => {},
	};
}
