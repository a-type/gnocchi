import {
	StorageCollectionSchema,
	StorageCompoundIndexSchema,
} from '@aglio/storage-common';

export function computeSynthetics(
	schema: StorageCollectionSchema<any, any>,
	obj: any,
) {
	const result: Record<string, any> = {};
	for (const [name, property] of Object.entries(schema.synthetics)) {
		result[name] = (property as StorageCompoundIndexSchema<any>).compute(obj);
	}
	return result;
}
