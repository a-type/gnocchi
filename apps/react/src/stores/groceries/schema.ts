import { collection, migrate, schema } from '@lo-fi/web';
import cuid from 'cuid';

const categories = collection({
	name: 'category',
	pluralName: 'categories',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		name: {
			type: 'string',
		},
		sortKey: {
			type: 'string',
			indexed: true,
			default: 'a0',
		},
	},
});

const foodCategoryAssignments = collection({
	name: 'foodCategoryAssignment',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		foodName: {
			type: 'string',
			indexed: true,
		},
		categoryId: {
			type: 'string',
			indexed: true,
		},
		remote: {
			type: 'boolean',
		},
	},
});

const items = collection({
	name: 'item',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		categoryId: {
			type: 'string',
			indexed: true,
			nullable: true,
		},
		createdAt: {
			type: 'number',
			default: () => Date.now(),
		},
		totalQuantity: {
			type: 'number',
		},
		purchasedQuantity: {
			type: 'number',
			default: 0,
		},
		unit: {
			type: 'string',
		},
		food: {
			type: 'string',
			indexed: true,
		},
		sortKey: {
			type: 'string',
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

export default schema({
	version: 6,
	collections: {
		categories: categories,
		items: items,
		foodCategoryAssignments: foodCategoryAssignments,
	},
});
