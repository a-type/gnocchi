import {
	StorageCollectionSchema,
	StorageComputedSchema,
} from '@aglio/storage-common';

export function computeSynthetics(
	schema: StorageCollectionSchema<any, any>,
	obj: any,
) {
	const result: Record<string, any> = {};
	for (const [name, property] of Object.entries(schema.synthetics)) {
		result[name] = (property as StorageComputedSchema<any>).compute(obj);
	}
	return result;
}
