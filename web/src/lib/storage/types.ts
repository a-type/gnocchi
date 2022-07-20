import type { EventSubscriber } from 'lib/EventSubscriber';

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

export type StorageIndexableFields<Fields extends StorageFieldsSchema> = {
	[K in keyof Fields]: Fields[K]['type'] extends 'string' | 'number'
		? K
		: never;
};

export type StorageIndexableSynthetics<
	Fields extends StorageFieldsSchema,
	Synthetics extends StorageSyntheticsSchema<Fields>,
> = {
	[K in keyof Synthetics]: Synthetics[K]['type'] extends '#string' | '#number'
		? K
		: never;
};

export type StorageIndexablePropertyName<
	Fields extends StorageFieldsSchema,
	Computeds extends StorageSyntheticsSchema<Fields>,
> =
	| Extract<keyof StorageIndexableFields<Fields>, string>
	| Extract<keyof StorageIndexableSynthetics<Fields, Computeds>, string>;

export type OnlyIndexablePropertyNames<
	Fields extends StorageFieldsSchema,
	Synthetics extends StorageSyntheticsSchema<Fields>,
	Name extends string,
> = Name extends StorageIndexablePropertyName<Fields, Synthetics>
	? Name
	: never;

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
	primaryKey: StorageIndexablePropertyName<Fields, Synthetics>;
	migrate?: (oldData: any) => ShapeFromFields<Fields>;
};

export interface StorageCollectionSchema<
	Fields extends StorageFieldsSchema,
	Synthetics extends StorageSyntheticsSchema<Fields> = StorageSyntheticsSchema<Fields>,
	Indexes extends StoragePropertyName<
		Fields,
		Synthetics
	>[] = StoragePropertyName<Fields, Synthetics>[],
> {
	name: string;
	historicalSchemas?: StorageSchema<any, any, any>[];
	schema: StorageSchema<Fields, Synthetics, Indexes>;
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
> = StorageDocumentProperties<Collection>;

export type StorageDocumentProperties<
	Collection extends StorageCollectionSchema<any, any, any>,
> = ShapeFromFields<Collection['schema']['fields']> &
	ShapeFromComputeds<Collection['schema']['synthetics']>;

export type CollectionIndex<
	Collection extends StorageCollectionSchema<any, any, any>,
> = Collection['schema']['indexes'][number];
export type CollectionProperties<
	Collection extends StorageCollectionSchema<any, any, any>,
> = Collection['schema']['fields'] & Collection['schema']['synthetics'];

export type CollectionIndexFilter<
	Collection extends StorageCollectionSchema<any, any, any>,
	Index extends CollectionIndex<Collection>,
> = {
	where: Index;
	equals: ShapeFromProperty<CollectionProperties<Collection>[Index]>;
};

export type CollectionEvents<
	Collection extends StorageCollectionSchema<any, any, any>,
> = EventSubscriber<{
	add: (value: StorageDocument<Collection>) => void;
	update: (value: StorageDocument<Collection>) => void;
	delete: (id: string) => void;
	[key: `update:${string}`]: (value: StorageDocument<Collection>) => void;
	[key: `delete:${string}`]: () => void;
}>;
