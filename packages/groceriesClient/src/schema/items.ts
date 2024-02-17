import { schema } from '@verdant-web/common';
import cuid from 'cuid';

export const items = schema.collection({
	name: 'item',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: () => cuid(),
		}),
		categoryId: schema.fields.string({
			nullable: true,
		}),
		createdAt: schema.fields.number({
			default: () => Date.now(),
		}),
		totalQuantity: schema.fields.number(),
		unit: schema.fields.string(),
		food: schema.fields.string(),
		inputs: schema.fields.array({
			items: schema.fields.object({
				properties: {
					text: schema.fields.string(),
					url: schema.fields.string({
						nullable: true,
					}),
					title: schema.fields.string({
						nullable: true,
					}),
					multiplier: schema.fields.number({
						nullable: true,
					}),
					recipeId: schema.fields.string({
						nullable: true,
					}),
					quantity: schema.fields.number({
						nullable: true,
					}),
				},
			}),
		}),
		/**
		 * Mark this when the item is purchased. It moves to the pantry.
		 */
		purchasedAt: schema.fields.number({
			nullable: true,
		}),
		/**
		 * If assigned to a list, this ID will be
		 */
		listId: schema.fields.string({
			nullable: true,
		}),
		/**
		 * Shows up below the item, useful for reminders or notes
		 * about a brand, etc.
		 */
		comment: schema.fields.string({
			nullable: true,
		}),
		/**
		 * If set, this will be used instead of the food's name
		 * or input text.
		 */
		textOverride: schema.fields.string({
			nullable: true,
		}),
	},
	indexes: {
		categoryId: {
			field: 'categoryId',
		},
		food: {
			field: 'food',
		},
		purchasedAt: {
			field: 'purchasedAt',
		},
		purchased: {
			type: 'string',
			compute: (doc) => (!!doc.purchasedAt ? 'yes' : 'no'),
		},
		listId: {
			type: 'string',
			compute: (doc) => doc.listId,
		},
	},
	compounds: {
		// used when adding items to find items with the same food
		// and list that aren't purchased, and if so, add the quantity
		// instead of creating a new item.
		purchased_food_listId: {
			of: ['purchased', 'food', 'listId'],
		},
	},
});
