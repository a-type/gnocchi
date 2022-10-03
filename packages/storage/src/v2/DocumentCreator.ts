import {
	addOid,
	createOid,
	initialToPatches,
	SchemaCollection,
	SchemaCollectionName,
	ShapeFromFields,
	StorageDocument,
	StorageDocumentInit,
	StorageSchema,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import { DocumentStore } from './DocumentStore.js';
import { Metadata } from './Metadata.js';

/**
 * Exposes functionality for creating documents,
 * the only mutation which is available as an entry
 * point in the storage system.
 */
export class DocumentCreator<Schema extends StorageSchema<any>> {
	constructor(
		private meta: Metadata,
		private schema: Schema,
		private documents: DocumentStore,
	) {}

	create = async <Collection extends SchemaCollectionName<Schema>>(
		collection: Collection,
		init: StorageDocumentInit<SchemaCollection<Schema, Collection>>,
	) => {
		const primaryKeyName = this.schema.collections[collection]
			.primaryKey as keyof StorageDocument<
			SchemaCollection<Schema, Collection>
		>;
		const primaryKey = init[primaryKeyName] as string;
		assert(
			primaryKey,
			`Document must have a primary key: ${primaryKeyName.toString()}`,
		);
		const oid = createOid(collection as string, primaryKey);

		return this.documents.applyLocalOperation(
			await this.meta.messageCreator.createOperation({
				rootOid: oid,
				patches: initialToPatches(init, oid),
			}),
		);
	};
}
