import { collection, migrate, schema } from '@lo-fi/web';

const categories = collection({
	name: 'category',
	pluralName: 'categories',
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

const foodCategoryAssignments = collection({
	name: 'foodCategoryAssignment',
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

const items = collection({
	name: 'item',
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

export default schema({
	version: 4,
	collections: {
		categories: categories,
		items: items,
		foodCategoryAssignments: foodCategoryAssignments,
	},
});
