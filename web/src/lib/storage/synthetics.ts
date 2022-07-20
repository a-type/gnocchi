import { StorageComputedSchema, StorageSchema } from './types';

export function computeSynthetics(schema: StorageSchema<any, any>, obj: any) {
	const result: Record<string, any> = {};
	for (const [name, property] of Object.entries(schema.synthetics)) {
		result[name] = (property as StorageComputedSchema<any>).compute(obj);
	}
	return result;
}
