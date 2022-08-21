import {
	StorageCollectionSchema,
	StorageFieldsSchema,
	StorageSyntheticsSchema,
} from './types.js';

export function collection<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields>,
>(input: StorageCollectionSchema<Fields, Computeds>) {
	return input;
}

export * from './types.js';
