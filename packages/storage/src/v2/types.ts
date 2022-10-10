import {
	StorageCollectionSchema,
	StorageDocument,
} from '@aglio/storage-common';
import { ObjectEntity } from './Entity.js';

export type Document<
	Collection extends StorageCollectionSchema<any, any, any>,
> = ObjectEntity<StorageDocument<Collection>>;
