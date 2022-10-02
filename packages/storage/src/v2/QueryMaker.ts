import {
	CollectionFilter,
	CollectionIndexName,
	StorageSchema,
} from '@aglio/storage-common';

export class QueryMaker<Schema extends StorageSchema<any>> {
	constructor(private schema: Schema) {}

	get = (collection: keyof Schema['collections'], primaryKey: string) => {};

	findOne = <
		Collection extends keyof Schema['collections'],
		Index extends CollectionIndexName<Schema['collections'][Collection]>,
	>(
		collection: Collection,
		query: CollectionFilter<Schema['collections'][Collection], Index>,
	) => {};

	findAll = <
		Collection extends keyof Schema['collections'],
		Index extends CollectionIndexName<Schema['collections'][Collection]>,
	>(
		collection: Collection,
		query: CollectionFilter<Schema['collections'][Collection], Index>,
	) => {};
}
