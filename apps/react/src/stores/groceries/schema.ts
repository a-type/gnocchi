import { collection, schema, StorageDocument } from '@aglio/storage-common';

export const categoryCollection = collection({
	name: 'categories',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			indexed: true,
			unique: true,
		},
		name: {
			type: 'string',
			indexed: false,
			unique: false,
		},
	},
	synthetics: {},
});
export type GroceryCategory = StorageDocument<typeof categoryCollection>;

export const foodCategoryLookupCollection = collection({
	name: 'foodCategoryLookups',
	primaryKey: 'foodName',
	fields: {
		foodName: {
			type: 'string',
			indexed: true,
			unique: true,
		},
		categoryId: {
			type: 'string',
			indexed: true,
			unique: false,
		},
	},
	synthetics: {},
});
export type FoodCategoryLookup = StorageDocument<
	typeof foodCategoryLookupCollection
>;

export const itemCollection = collection({
	name: 'items',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			indexed: true,
			unique: true,
		},
		categoryId: {
			type: 'string',
			indexed: true,
			unique: false,
		},
		createdAt: {
			type: 'number',
			indexed: false,
			unique: false,
		},
		totalQuantity: {
			type: 'number',
			indexed: false,
			unique: false,
		},
		purchasedQuantity: {
			type: 'number',
			indexed: false,
			unique: false,
		},
		unit: {
			type: 'string',
			indexed: false,
			unique: false,
		},
		food: {
			type: 'string',
			indexed: true,
			unique: false,
		},
		sortKey: {
			type: 'string',
			indexed: false,
			unique: false,
		},
		inputs: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					text: {
						type: 'string',
					},
				},
			},
		},
	},
	synthetics: {
		purchased: {
			type: 'string',
			indexed: true,
			unique: false,
			compute: (doc) =>
				doc.purchasedQuantity >= doc.totalQuantity ? 'yes' : 'no',
		},
	},
});
export type GroceryItem = StorageDocument<typeof itemCollection>;

export const groceriesSchema = schema({
	version: 1,
	collections: {
		categories: categoryCollection,
		foodCategoryLookups: foodCategoryLookupCollection,
		items: itemCollection,
	},
});
