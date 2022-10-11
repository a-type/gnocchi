import { collection, migrate, schema, Document } from '@lofi-db/web';
import { v3Schema } from './v3.js';

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
export type GroceryCategory = Document<typeof categoryCollection>;

export const foodCategoryAssignment = collection({
	name: 'foodCategoryAssignments',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			indexed: true,
			unique: true,
		},
		foodName: {
			type: 'string',
			indexed: true,
			unique: false,
		},
		categoryId: {
			type: 'string',
			indexed: true,
			unique: false,
		},
		remote: {
			type: 'boolean',
		},
	},
	synthetics: {},
	compounds: {},
});
export type FoodCategoryLookup = Document<typeof foodCategoryAssignment>;

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
					url: {
						type: 'string',
						nullable: true,
					},
					title: {
						type: 'string',
						nullable: true,
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
export type GroceryItem = Document<typeof itemCollection>;

export const v4Schema = schema({
	version: 4,
	collections: {
		categories: categoryCollection,
		items: itemCollection,
		foodCategoryAssignments: foodCategoryAssignment,
	},
});

export default migrate(v3Schema, v4Schema, async ({ identity, migrate }) => {
	await Promise.all([
		migrate('items', identity),
		migrate('categories', identity),
		migrate('foodCategoryAssignments', identity),
	]);
});
