export type StorageStringFieldSchema = {
	type: 'string';
	indexed?: boolean;
	unique?: boolean;
};
export type StorageNumberFieldSchema = {
	type: 'number';
	indexed?: boolean;
	unique?: boolean;
};
export type StorageBooleanFieldSchema = {
	type: 'boolean';
};
export type StorageArrayFieldSchema = {
	type: 'array';
	items: NestedStorageFieldSchema;
};
export type StorageObjectFieldSchema = {
	type: 'object';
	properties: NestedStorageFieldsSchema;
};
export type StorageFieldSchema =
	| StorageStringFieldSchema
	| StorageNumberFieldSchema
	| StorageBooleanFieldSchema
	| StorageArrayFieldSchema
	| StorageObjectFieldSchema;

// nested versions don't have index info
export type NestedStorageStringFieldSchema = {
	type: 'string';
};
export type NestedStorageNumberFieldSchema = {
	type: 'number';
};

export type NestedStorageFieldSchema =
	| NestedStorageStringFieldSchema
	| NestedStorageNumberFieldSchema
	| StorageBooleanFieldSchema
	| StorageArrayFieldSchema
	| StorageObjectFieldSchema;

export type StorageStringCompoundSchema<Fields extends StorageFieldsSchema> = {
	type: 'string';
	unique?: boolean;
	compute: (value: ShapeFromFields<Fields>) => string;
};
export type StorageNumberCompoundSchema<Fields extends StorageFieldsSchema> = {
	type: 'number';
	unique?: boolean;
	compute: (value: ShapeFromFields<Fields>) => number;
};
export type StorageCompoundIndexSchema<Fields extends StorageFieldsSchema> =
	| StorageStringCompoundSchema<Fields>
	| StorageNumberCompoundSchema<Fields>;

export type StoragePropertySchema<BaseFields extends StorageFieldsSchema> =
	| StorageFieldSchema
	| NestedStorageFieldSchema
	| StorageCompoundIndexSchema<BaseFields>;

export type StorageFieldsSchema = Record<string, StorageFieldSchema>;

export type NestedStorageFieldsSchema = Record<
	string,
	NestedStorageFieldSchema
>;

export type StorageCompoundIndices<Fields extends StorageFieldsSchema> = Record<
	string,
	StorageCompoundIndexSchema<Fields>
>;

export type StoragePropertyName<
	Fields extends StorageFieldsSchema,
	Compounds extends StorageCompoundIndices<Fields>,
> =
	| Exclude<keyof Fields, number | symbol>
	| Exclude<keyof Compounds, number | symbol>;

// filters to only fields which can be indexed
export type StorageIndexableFields<Fields extends StorageFieldsSchema> = {
	[K in keyof Fields]: Fields[K] extends { indexed: boolean } ? K : never;
};

export type StorageIndexablePropertyName<
	Fields extends StorageFieldsSchema,
	Compounds extends StorageCompoundIndices<Fields>,
> =
	| Extract<keyof StorageIndexableFields<Fields>, string>
	| Extract<keyof Compounds, string>;

export type StorageSchemaProperties<
	Schema extends StorageCollectionSchema<any, any>,
> = Schema extends StorageCollectionSchema<infer F, infer S> ? F & S : never;

// extracting fields/computed from schema
export type CollectionSchemaFields<
	Schema extends StorageCollectionSchema<any, any>,
> = Schema extends StorageCollectionSchema<infer F, any> ? F : never;
export type CollectionSchemaComputedIndexes<
	Schema extends StorageCollectionSchema<any, any>,
> = Schema extends StorageCollectionSchema<any, infer C> ? C : never;

export type StorageIndexableProperties<
	Schema extends StorageCollectionSchema<any, any>,
> = {
	[K in keyof CollectionSchemaFields<Schema>]: CollectionSchemaFields<Schema>[K] extends {
		indexed: boolean;
	}
		? CollectionSchemaFields<Schema>[K]
		: never;
} & CollectionSchemaComputedIndexes<Schema>;

export type StorageSchemaProperty<
	Schema extends StorageCollectionSchema<any, any>,
> = StorageSchemaProperties<Schema>[keyof StorageSchemaProperties<Schema>];

export type StorageSchemaPropertyName<
	Schema extends StorageCollectionSchema<any, any>,
> = Extract<keyof StorageSchemaProperties<Schema>, string>;

export type GetSchemaProperty<
	Schema extends StorageCollectionSchema<any, any>,
	Key extends StorageSchemaPropertyName<Schema>,
> = StorageSchemaProperties<Schema>[Key];

export type ShapeFromProperty<T extends StoragePropertySchema<any>> =
	T['type'] extends 'string'
		? string
		: T['type'] extends 'number'
		? number
		: T['type'] extends 'boolean'
		? boolean
		: T extends StorageArrayFieldSchema
		? ShapeFromProperty<T['items']>[]
		: T extends StorageObjectFieldSchema
		? ShapeFromFields<T['properties']>
		: never;

export type ShapeFromFields<
	T extends StorageFieldsSchema | NestedStorageFieldsSchema,
> = {
	[K in keyof T]: ShapeFromProperty<T[K]>;
};

export type ShapeFromComputeds<T extends StorageCompoundIndices<any>> = {
	[K in keyof T]: ShapeFromProperty<T[K]>;
};

export type StorageCollectionSchema<
	Fields extends StorageFieldsSchema,
	Synthetics extends StorageCompoundIndices<Fields>,
> = {
	name: string;
	fields: Fields;
	synthetics: Synthetics;
	primaryKey: StorageIndexablePropertyName<Fields, Synthetics>;
};

export type StorageSchema<
	Collections extends {
		[k: string]: StorageCollectionSchema<any, any>;
	},
> = { version: number; collections: Collections };

export interface StorageInit<
	Schemas extends StorageCollectionSchema<any, any>,
> {
	collections: Record<string, Schemas>;
}

export type NamedSchema<
	Schemas extends StorageCollectionSchema<any, any>,
	Name extends string,
> = Schemas extends { name: Name } ? Schemas : never;

export type StorageDocument<
	Collection extends StorageCollectionSchema<any, any>,
> = ShapeFromFields<Collection['fields']>;

export type IndexedSchemaProperties<
	Schema extends StorageCollectionSchema<any, any>,
> = {
	[K in keyof CollectionSchemaFields<Schema> as CollectionSchemaFields<Schema>[K] extends {
		indexed: true;
	}
		? K
		: never]: CollectionSchemaFields<Schema>[K];
} & CollectionSchemaComputedIndexes<Schema>;

export type CollectionIndex<
	Collection extends StorageCollectionSchema<any, any>,
> = Extract<keyof IndexedSchemaProperties<Collection>, string>;

export type CollectionProperties<
	Collection extends StorageCollectionSchema<any, any>,
> = Collection['fields'] & Collection['synthetics'];

export type MatchCollectionIndexFilter<
	Collection extends StorageCollectionSchema<any, any>,
	Index extends CollectionIndex<Collection>,
> = {
	where: Index;
	equals: ShapeFromProperty<CollectionProperties<Collection>[Index]>;
	order?: 'asc' | 'desc';
};

export type RangeCollectionIndexFilter<
	Collection extends StorageCollectionSchema<any, any>,
	Index extends CollectionIndex<Collection>,
> = {
	where: Index;
	gte?: ShapeFromProperty<CollectionProperties<Collection>[Index]>;
	lte?: ShapeFromProperty<CollectionProperties<Collection>[Index]>;
	gt?: ShapeFromProperty<CollectionProperties<Collection>[Index]>;
	lt?: ShapeFromProperty<CollectionProperties<Collection>[Index]>;
	order?: 'asc' | 'desc';
};

export type CollectionIndexFilter<
	Collection extends StorageCollectionSchema<any, any>,
	Index extends CollectionIndex<Collection>,
> =
	| MatchCollectionIndexFilter<Collection, Index>
	| RangeCollectionIndexFilter<Collection, Index>;

export type CollectionEvents<
	Collection extends StorageCollectionSchema<any, any>,
> = {
	put: (value: StorageDocument<Collection>) => void;
	delete: (id: string) => void;
	[key: `put:${string}`]: (value: StorageDocument<Collection>) => void;
	[key: `delete:${string}`]: () => void;
};

export type SchemaForCollection<
	Collection extends StorageCollectionSchema<any, any>,
> = Collection;

export type StorageDocumentWithComputedIndices<
	Collection extends StorageCollectionSchema<any, any>,
> = StorageDocument<Collection> &
	ShapeFromComputeds<CollectionSchemaComputedIndexes<Collection>>;
