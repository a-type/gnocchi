import {
	addOid,
	createOid,
	initialToPatches,
	SchemaCollection,
	SchemaCollectionName,
	StorageDocument,
	StorageSchema,
} from '@aglio/storage-common';
import { assert } from '@aglio/tools';
import { Metadata } from './Metadata.js';

/**
 * Exposes functionality for creating documents,
 * the only mutation which is available as an entry
 * point in the storage system.
 */
export class DocumentCreator<Schema extends StorageSchema<any>> {
	constructor(private meta: Metadata, private schema: Schema) {}

	create = async <Collection extends SchemaCollectionName<Schema>>(
		collection: Collection,
		init: StorageDocument<SchemaCollection<Schema, Collection>>,
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

		const withOid = addOid(init, oid);

		await this.meta.insertLocalOperation(
			await this.meta.messageCreator.createOperation({
				rootOid: oid,
				patches: initialToPatches(withOid),
			}),
		);
	};
}
