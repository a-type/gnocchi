export type StorageStringFieldSchema = {
	type: 'string';
};
export type StorageNumberFieldSchema = {
	type: 'number';
};
export type StorageBooleanFieldSchema = {
	type: 'boolean';
};
export type StorageArrayFieldSchema = {
	type: 'array';
	items: StorageFieldSchema;
};
export type StorageObjectFieldSchema = {
	type: 'object';
	properties: StorageFieldsSchema;
};
export type StorageFieldSchema =
	| StorageStringFieldSchema
	| StorageNumberFieldSchema
	| StorageBooleanFieldSchema
	| StorageArrayFieldSchema
	| StorageObjectFieldSchema;

export type StringStorageComputedSchema<Fields extends StorageFieldsSchema> = {
	type: '#string';
	compute: (value: ShapeFromFields<Fields>) => string;
};
export type NumberStorageComputedSchema<Fields extends StorageFieldsSchema> = {
	type: '#number';
	compute: (value: ShapeFromFields<Fields>) => number;
};
export type BooleanStorageComputedSchema<Fields extends StorageFieldsSchema> = {
	type: '#boolean';
	compute: (value: ShapeFromFields<Fields>) => boolean;
};
export type StorageComputedSchema<Fields extends StorageFieldsSchema> =
	| StringStorageComputedSchema<Fields>
	| NumberStorageComputedSchema<Fields>
	| BooleanStorageComputedSchema<Fields>;

export type StoragePropertySchema<BaseFields extends StorageFieldsSchema> =
	| StorageFieldSchema
	| StorageComputedSchema<BaseFields>;

export type StorageFieldsSchema = Record<string, StorageFieldSchema>;

export type StorageSyntheticsSchema<Fields extends StorageFieldsSchema> =
	Record<string, StorageComputedSchema<Fields>>;

export type StoragePropertyName<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields>,
> =
	| Exclude<keyof Fields, number | symbol>
	| Exclude<keyof Computeds, number | symbol>;

export type StoragePropertiesSchema<BaseFields extends StorageFieldsSchema> =
	BaseFields & StorageComputedSchema<BaseFields>;

export type OnlyIndexableProperty<Prop extends StoragePropertySchema<any>> =
	Prop extends
		| StorageStringFieldSchema
		| StorageNumberFieldSchema
		| StringStorageComputedSchema<any>
		| NumberStorageComputedSchema<any>
		? Prop
		: never;

export type GetSchemaProperty<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields>,
	Key extends StoragePropertyName<Fields, Computeds>,
> = Fields[Key] | Computeds[Key];

export type ShapeFromProperty<T extends StoragePropertySchema<any>> =
	T extends StorageStringFieldSchema
		? string
		: T extends StorageNumberFieldSchema
		? number
		: T extends StorageBooleanFieldSchema
		? boolean
		: T extends StringStorageComputedSchema<any>
		? string
		: T extends NumberStorageComputedSchema<any>
		? number
		: T extends BooleanStorageComputedSchema<any>
		? boolean
		: T extends StorageObjectFieldSchema
		? ShapeFromFields<T['properties']>
		: T extends StorageArrayFieldSchema
		? ShapeFromProperty<T['items']>[]
		: never;

export type ShapeFromFields<T extends StorageFieldsSchema> = {
	[K in keyof T]: ShapeFromProperty<T[K]>;
};

export type ShapeFromComputeds<T extends StorageSyntheticsSchema<any>> = {
	[K in keyof T]: ShapeFromProperty<T[K]>;
};

export type StorageSchema<
	Fields extends StorageFieldsSchema,
	Synthetics extends StorageSyntheticsSchema<Fields>,
	Indexes extends StoragePropertyName<Fields, Synthetics>[],
> = {
	version: number;
	fields: Fields;
	synthetics: Synthetics;
	indexes: Indexes;
	unique: readonly StoragePropertyName<Fields, Synthetics>[];
	migrate?: (oldData: any) => ShapeFromFields<Fields>;
};

export interface StorageCollectionSchema<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields> = StorageSyntheticsSchema<Fields>,
	Indexes extends StoragePropertyName<
		Fields,
		Computeds
	>[] = StoragePropertyName<Fields, Computeds>[],
> {
	name: string;
	historicalSchemas?: StorageSchema<any, any, any>[];
	schema: StorageSchema<Fields, Computeds, Indexes>;
}

export interface StorageInit<
	Schemas extends StorageCollectionSchema<any, any, any>,
> {
	collections: Record<string, Schemas>;
}

export type NamedSchema<
	Schemas extends StorageCollectionSchema<any, any, any>,
	Name extends string,
> = Schemas extends { name: Name } ? Schemas : never;

export type StorageDocument<
	Collection extends StorageCollectionSchema<any, any, any>,
> = { id: string } & StorageDocumentProperties<Collection>;

export type StorageDocumentProperties<
	Collection extends StorageCollectionSchema<any, any, any>,
> = ShapeFromFields<Collection['schema']['fields']> &
	ShapeFromComputeds<Collection['schema']['synthetics']>;
