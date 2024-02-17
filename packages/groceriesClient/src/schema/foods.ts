import { schema } from '@verdant-web/common';
import { fullTextIndex } from '../fullTextIndex.js';

export const foods = schema.collection({
	name: 'food',
	primaryKey: 'canonicalName',
	fields: {
		canonicalName: schema.fields.string(),
		alternateNames: schema.fields.array({
			items: schema.fields.string(),
		}),
		categoryId: schema.fields.string({
			nullable: true,
		}),
		expiresAfterDays: schema.fields.number({
			nullable: true,
		}),
		lastPurchasedAt: schema.fields.number({
			nullable: true,
		}),
		inInventory: schema.fields.boolean({
			default: false,
		}),
		/**
		 * This can be, and is, set in the future at the time of purchase
		 * based on expiration.
		 */
		expiresAt: schema.fields.number({
			nullable: true,
		}),
		frozenAt: schema.fields.number({
			nullable: true,
		}),
		purchaseIntervalGuess: schema.fields.number({
			nullable: true,
		}),
		lastAddedAt: schema.fields.number({
			nullable: true,
		}),
		purchaseCount: schema.fields.number({
			default: 0,
		}),
		defaultListId: schema.fields.string({
			nullable: true,
		}),
		pluralizeName: schema.fields.boolean({
			default: false,
		}),
		doNotSuggest: schema.fields.boolean({
			default: false,
		}),
	},
	indexes: {
		categoryId: {
			field: 'categoryId',
		},
		nameLookup: {
			type: 'string[]',
			compute: (food) =>
				Array.from(
					new Set(
						[food.canonicalName, ...food.alternateNames].map(fullTextIndex),
					),
				).flat(),
		},
		anyName: {
			type: 'string[]',
			compute: (food) => [food.canonicalName, ...food.alternateNames],
		},
		repurchaseAfter: {
			type: 'number',
			compute: (food) => {
				if (
					!food.lastPurchasedAt ||
					!food.purchaseIntervalGuess ||
					food.purchaseCount < 4
				)
					return Number.MAX_SAFE_INTEGER;
				const lastAdded = food.lastAddedAt || 0;
				return (
					Math.max(food.lastPurchasedAt, lastAdded) + food.purchaseIntervalGuess
				);
			},
		},
		purchasedAndExpiresAt: {
			type: 'number',
			compute: (food) => {
				if (!food.lastPurchasedAt) return Number.MAX_SAFE_INTEGER;
				return food.expiresAt || Number.MAX_SAFE_INTEGER;
			},
		},
		// if no purchased time is recorded, sorts to the bottom instead
		// of the top.
		lastPurchasedAtOrZero: {
			type: 'number',
			compute: (food) => {
				return food.lastPurchasedAt || 0;
			},
		},
		frozen: {
			type: 'boolean',
			compute: (food) => !!food.frozenAt,
		},
	},
	compounds: {
		// allows showing recently purchased items in pages under category sections
		// on the purchased page.
		categoryId_lastPurchasedAt: {
			of: ['categoryId', 'lastPurchasedAtOrZero'],
		},
		inInventory_categoryId_lastPurchasedAt: {
			of: ['inInventory', 'categoryId', 'lastPurchasedAtOrZero'],
		},
	},
});
