import { schema, collection } from '@lo-fi/web';
import cuid from 'cuid';

const collections = collection({
	name: 'collection',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		name: {
			type: 'string',
		},
	},
});

const recipes = collection({
	name: 'recipe',
	primaryKey: 'id',
	fields: {
		id: {
			type: 'string',
			default: () => cuid(),
		},
		collectionId: {
			type: 'string',
			indexed: true,
			nullable: true,
		},
		slug: {
			type: 'string',
			indexed: true,
			default: () => cuid(),
		},
		title: {
			type: 'string',
			default: 'New Recipe',
		},
		createdAt: {
			type: 'number',
			default: () => Date.now(),
		},
		updatedAt: {
			type: 'number',
			default: () => Date.now(),
			indexed: true,
		},
		ingredients: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						default: () => cuid(),
					},
					text: {
						type: 'string',
					},
					unit: {
						type: 'string',
						nullable: true,
					},
					food: {
						type: 'string',
					},
					quantity: {
						type: 'number',
						default: 1,
					},
					comments: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
		instructions: {
			type: 'any',
			default: undefined,
		},
	},
});

export default schema({
	version: 2,
	collections: {
		recipes,
		collections,
	},
});
