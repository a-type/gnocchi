import { LiveDocument } from '@aglio/storage';
import {
	collection,
	migrate,
	schema,
	StorageDocument,
} from '@aglio/storage-common';
import { v1Schema } from './v1.js';

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
	compounds: {},
});
export type GroceryCategory = LiveDocument<
	StorageDocument<typeof categoryCollection>
>;

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
	compounds: {},
});
export type FoodCategoryLookup = LiveDocument<
	StorageDocument<typeof foodCategoryLookupCollection>
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
			compute: (doc) =>
				doc.totalQuantity > 0 && doc.purchasedQuantity >= doc.totalQuantity
					? 'yes'
					: 'no',
		},
	},
	compounds: {
		categoryId_sortKey: {
			of: ['categoryId', 'sortKey'],
		},
	},
});
export type GroceryItem = LiveDocument<StorageDocument<typeof itemCollection>>;

export const v2Schema = schema({
	version: 2,
	collections: {
		categories: categoryCollection,
		foodCategoryLookups: foodCategoryLookupCollection,
		items: itemCollection,
	},
});

export default migrate(v1Schema, v2Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		migrate('foodCategoryLookups', identity),
	]);
});