import { collection, schema } from '@lo-fi/web';

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

export default schema({
	version: 2,
	collections: {
		categories: categoryCollection,
		foodCategoryLookups: foodCategoryLookupCollection,
		items: itemCollection,
	},
});
