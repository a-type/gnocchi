import { schema } from '@verdant-web/common';
import cuid from 'cuid';

export const categories = schema.collection({
	name: 'category',
	pluralName: 'categories',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: () => cuid(),
		}),
		name: schema.fields.string(),
		sortKey: schema.fields.string({
			default: 'a0',
		}),
		/**
		 * An estimate of how long items in this category
		 * take to expire. If not specified, items will not
		 * auto-expire.
		 */
		expirationDays: schema.fields.number({
			nullable: true,
		}),

		/**
		 * Users can claim a category to be responsible for
		 * it. This is a reference to the user who claimed
		 * it by their ID. Claims expire after 24 hours.
		 */
		claim: schema.fields.object({
			nullable: true,
			properties: {
				claimedBy: schema.fields.string(),
				claimedAt: schema.fields.number(),
			},
		}),
	},
	indexes: {
		sortKey: {
			field: 'sortKey',
		},
	},
});
