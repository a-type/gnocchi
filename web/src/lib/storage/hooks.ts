import { Storage } from './Storage';
import { StorageCollectionSchema } from './types';

export function createHooks<
	Schemas extends Record<string, StorageCollectionSchema<any, any, any>>,
>(storage: Storage<Schemas>) {}
