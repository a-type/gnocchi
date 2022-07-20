import {
	CollectionIndexFilter,
	IndexedSchemaProperties,
} from 'lib/storage/types';
import { itemCollection } from '.';

type Test = CollectionIndexFilter<typeof itemCollection, 'id'>;
type Test2 = IndexedSchemaProperties<typeof itemCollection['schema']>;
