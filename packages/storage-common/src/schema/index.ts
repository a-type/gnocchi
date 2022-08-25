import {
	StorageCollectionSchema,
	StorageFieldsSchema,
	StorageSchema,
	StorageCompoundIndices,
} from './types.js';

export function collection<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageCompoundIndices<Fields>,
>(input: StorageCollectionSchema<Fields, Computeds>) {
	return input;
}

export function schema<
	Schema extends StorageSchema<{
		[key: string]: StorageCollectionSchema<any, any>;
	}>,
>(input: Schema) {
	return input;
}

export * from './types.js';
