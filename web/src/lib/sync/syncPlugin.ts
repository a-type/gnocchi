import { addRxPlugin, RxCollection, RxDocument, RxPlugin } from 'rxdb';
import { compare } from 'fast-json-patch';
import { syncClient } from './syncClient';

export const SyncPlugin: RxPlugin = {
	rxdb: true,
	name: 'sync',

	init: () => {},

	prototypes: {
		RxDocument: (proto: RxDocument) => {
			const originals = {
				atomicUpdate: proto.atomicUpdate,
				remove: proto.remove,
			};
			proto.atomicUpdate = async function (mutationFn) {
				const collectionName = this.collection.name;
				const documentId = (this as any).id;
				if (!documentId) {
					return originals.atomicUpdate.call(this, mutationFn);
				}
				console.log('patch', 'on', documentId);
				const old = { [collectionName]: { [documentId]: { ...this._data } } };
				const updated = await originals.atomicUpdate.call(this, mutationFn);
				const diff = compare(old, {
					[collectionName]: { [documentId]: { ...updated._data } },
				});
				syncClient.onPatch(diff);
				return updated;
			};
			proto.remove = async function () {
				const collectionName = this.collection.name;
				const documentId = (this as any).id;
				if (!documentId) {
					return originals.remove.call(this);
				}
				console.log('remove', documentId);
				const old = { [collectionName]: { [documentId]: { ...this._data } } };
				const updated = await originals.remove.call(this);
				const diff = compare(old, {
					[collectionName]: {},
				});
				console.log(diff);
				syncClient.onPatch(diff);
				return updated;
			};
		},
		RxCollection: (proto: RxCollection) => {
			const originals = {
				insert: proto.insert,
				bulkInsert: proto.bulkInsert,
				bulkRemove: proto.bulkRemove,
			};
			proto.insert = async function (doc: any) {
				console.log('insert', doc, 'on', this.name);
				const created = await originals.insert.apply(this, [doc]);
				const diff = compare(
					{
						[this.name]: {},
					},
					{
						[this.name]: { [created.id]: { ...created._data } },
					},
				);
				syncClient.onPatch(diff);
				return created;
			};
			proto.bulkInsert = async function (docs: any[]) {
				console.log('bulkInsert', docs, 'on', this.name);
				const created = await originals.bulkInsert.apply(this, [docs]);
				for (let i = 0; i < docs.length; i++) {
					if (!created.success[i]) continue;
					if (!docs[i].id) continue;
					const doc = await this.findOne({
						selector: {
							id: docs[i].id,
						},
					}).exec();
					const diff = compare(
						{
							[this.name]: {},
						},
						{
							[this.name]: { [doc.id]: { ...doc._data } },
						},
					);
					syncClient.onPatch(diff);
				}
				return created;
			};
			proto.bulkRemove = async function (docs: string[]) {
				console.log('bulkRemove', docs, 'on', this.name);
				const result = await originals.bulkRemove.apply(this, [docs]);
				// TODO: this patch would be trivial to construct manually
				for (let i = 0; i < docs.length; i++) {
					const doc = docs[i];
					if (!doc) continue;
					const diff = compare(
						{
							[this.name]: { [doc]: {} },
						},
						{
							[this.name]: {},
						},
					);
					syncClient.onPatch(diff);
				}
				return result;
			};
		},
	},

	overwritable: {},
};

addRxPlugin(SyncPlugin);
