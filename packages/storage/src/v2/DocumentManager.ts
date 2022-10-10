import {
	assignOid,
	createOid,
	diffToPatches,
	initialToPatches,
	SchemaCollection,
	SchemaCollectionName,
	ShapeFromFields,
	StorageDocument,
	StorageDocumentInit,
	StorageSchema,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import { ObjectEntity } from './Entity.js';
import { EntityStore } from './EntityStore.js';
import { Metadata } from './Metadata.js';
import { Document } from './types.js';

/**
 * Exposes functionality for creating documents,
 * the only mutation which is available as an entry
 * point in the storage system.
 */
export class DocumentManager<Schema extends StorageSchema<any>> {
	constructor(
		private meta: Metadata,
		private schema: Schema,
		private entities: EntityStore,
	) {}

	private getOid = (collection: string, init: any) => {
		const primaryKeyName = this.schema.collections[collection]
			.primaryKey as Exclude<
			keyof StorageDocument<SchemaCollection<Schema, any>>,
			symbol
		>;
		const primaryKey = init[primaryKeyName] as string;
		assert(
			primaryKey,
			`Document must have a primary key: ${primaryKeyName.toString()}`,
		);
		return createOid(collection as string, primaryKey);
	};

	create = async <Collection extends SchemaCollectionName<Schema>>(
		collection: Collection,
		init: StorageDocumentInit<SchemaCollection<Schema, Collection>>,
	) => {
		const oid = this.getOid(collection, init);
		// documents are always objects at the root
		return this.entities.create(init, oid) as Promise<
			Document<SchemaCollection<Schema, Collection>>
		>;
	};

	upsert = async <Collection extends SchemaCollectionName<Schema>>(
		collection: Collection,
		init: StorageDocumentInit<SchemaCollection<Schema, Collection>>,
	) => {
		const oid = this.getOid(collection, init);
		const existing = await this.entities.getFromOid(oid);
		if (existing) {
			const patches = diffToPatches(
				assignOid(existing.getSnapshot(), oid),
				assignOid(init, oid),
				() => this.meta.now,
			);
			this.entities.enqueueOperations(patches);
			return existing;
		} else {
			// documents are always objects at the root
			return this.entities.create(init, oid) as Promise<ObjectEntity<any>>;
		}
	};

	delete = async <Collection extends SchemaCollectionName<Schema>>(
		collection: Collection,
		primaryKey: string,
	) => {
		const oid = createOid(collection as string, primaryKey);
		return this.entities.delete(oid);
	};
}
