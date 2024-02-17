/** @generated - do not modify this file. */

// src/schema.ts
import { schema as schema8 } from '@verdant-web/store';

// src/schema/categories.ts
import { schema } from '@verdant-web/common';
import cuid from 'cuid';
var categories = schema.collection({
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

// src/schema/items.ts
import { schema as schema2 } from '@verdant-web/common';
import cuid2 from 'cuid';
var items = schema2.collection({
	name: 'item',
	primaryKey: 'id',
	fields: {
		id: schema2.fields.string({
			default: () => cuid2(),
		}),
		categoryId: schema2.fields.string({
			nullable: true,
		}),
		createdAt: schema2.fields.number({
			default: () => Date.now(),
		}),
		totalQuantity: schema2.fields.number(),
		unit: schema2.fields.string(),
		food: schema2.fields.string(),
		inputs: schema2.fields.array({
			items: schema2.fields.object({
				properties: {
					text: schema2.fields.string(),
					url: schema2.fields.string({
						nullable: true,
					}),
					title: schema2.fields.string({
						nullable: true,
					}),
					multiplier: schema2.fields.number({
						nullable: true,
					}),
					recipeId: schema2.fields.string({
						nullable: true,
					}),
					quantity: schema2.fields.number({
						nullable: true,
					}),
				},
			}),
		}),
		/**
		 * Mark this when the item is purchased. It moves to the pantry.
		 */
		purchasedAt: schema2.fields.number({
			nullable: true,
		}),
		/**
		 * If assigned to a list, this ID will be
		 */
		listId: schema2.fields.string({
			nullable: true,
		}),
		/**
		 * Shows up below the item, useful for reminders or notes
		 * about a brand, etc.
		 */
		comment: schema2.fields.string({
			nullable: true,
		}),
		/**
		 * If set, this will be used instead of the food's name
		 * or input text.
		 */
		textOverride: schema2.fields.string({
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

// src/schema/foods.ts
import { schema as schema3 } from '@verdant-web/common';

// src/fullTextIndex.ts
import { removeStopwords } from 'stopword';
function fullTextIndex(str) {
	return removeStopwords(str.split(/\s+/)).map((s) => s.toLowerCase());
}

// src/schema/foods.ts
var foods = schema3.collection({
	name: 'food',
	primaryKey: 'canonicalName',
	fields: {
		canonicalName: schema3.fields.string(),
		alternateNames: schema3.fields.array({
			items: schema3.fields.string(),
		}),
		categoryId: schema3.fields.string({
			nullable: true,
		}),
		expiresAfterDays: schema3.fields.number({
			nullable: true,
		}),
		lastPurchasedAt: schema3.fields.number({
			nullable: true,
		}),
		inInventory: schema3.fields.boolean({
			default: false,
		}),
		/**
		 * This can be, and is, set in the future at the time of purchase
		 * based on expiration.
		 */
		expiresAt: schema3.fields.number({
			nullable: true,
		}),
		frozenAt: schema3.fields.number({
			nullable: true,
		}),
		purchaseIntervalGuess: schema3.fields.number({
			nullable: true,
		}),
		lastAddedAt: schema3.fields.number({
			nullable: true,
		}),
		purchaseCount: schema3.fields.number({
			default: 0,
		}),
		defaultListId: schema3.fields.string({
			nullable: true,
		}),
		pluralizeName: schema3.fields.boolean({
			default: false,
		}),
		doNotSuggest: schema3.fields.boolean({
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

// src/schema/lists.ts
import { schema as schema4 } from '@verdant-web/common';
import cuid3 from 'cuid';
var lists = schema4.collection({
	name: 'list',
	primaryKey: 'id',
	fields: {
		id: schema4.fields.string({
			default: () => cuid3(),
		}),
		name: schema4.fields.string(),
		color: schema4.fields.string(),
	},
});

// src/schema/collaborationInfo.ts
import { schema as schema5 } from '@verdant-web/store';
var collaborationInfo = schema5.collection({
	name: 'collaborationInfo',
	pluralName: 'collaborationInfo',
	primaryKey: 'id',
	fields: {
		id: schema5.fields.string({
			default: 'default',
		}),
		meetup: schema5.fields.object({
			nullable: true,
			properties: {
				createdAt: schema5.fields.number({
					default: () => Date.now(),
				}),
				location: schema5.fields.string(),
			},
		}),
	},
});

// src/schema/recipes.ts
import { schema as schema6 } from '@verdant-web/common';
import cuid4 from 'cuid';
var recipes = schema6.collection({
	name: 'recipe',
	primaryKey: 'id',
	fields: {
		id: schema6.fields.string({
			default: () => cuid4(),
		}),
		slug: schema6.fields.string({
			default: () => cuid4.slug(),
		}),
		multiplier: schema6.fields.number({
			default: 1,
		}),
		title: schema6.fields.string({
			default: 'New Recipe',
		}),
		createdAt: schema6.fields.number({
			default: () => Date.now(),
		}),
		updatedAt: schema6.fields.number({
			default: () => Date.now(),
		}),
		prepTimeMinutes: schema6.fields.number({
			nullable: true,
		}),
		cookTimeMinutes: schema6.fields.number({
			nullable: true,
		}),
		totalTimeMinutes: schema6.fields.number({
			nullable: true,
		}),
		servings: schema6.fields.number({
			nullable: true,
		}),
		prelude: schema6.fields.any({
			default: {
				type: 'doc',
				content: [],
			},
		}),
		note: schema6.fields.string({
			nullable: true,
		}),
		ingredients: schema6.fields.array({
			items: schema6.fields.object({
				properties: {
					id: schema6.fields.string({
						default: () => cuid4(),
					}),
					text: schema6.fields.string(),
					unit: schema6.fields.string({
						nullable: true,
					}),
					food: schema6.fields.string({
						nullable: true,
					}),
					quantity: schema6.fields.number({
						default: 1,
					}),
					comments: schema6.fields.array({
						items: schema6.fields.string(),
					}),
					note: schema6.fields.string({
						nullable: true,
					}),
					isSectionHeader: schema6.fields.boolean({
						default: false,
					}),
				},
			}),
		}),
		instructions: schema6.fields.any({
			default: {
				type: 'doc',
				content: [],
			},
			/**
       * Potential instructions schema
       * for ProseMirror
      type: 'object',
      properties: {
      	type: {
      		type: 'string',
      		default: 'doc',
      	},
      	content: {
      		type: 'array',
      		items: {
      			type: 'object',
      			properties: {
      				type: {
      					type: 'string',
      				},
      				content: {
      					type: 'any',
      				},
      				attrs: {
      					type: 'map',
      					values: {
      						type: 'string'
      					}
      				}
      			},
      		},
      	}
      }
       */
		}),
		url: schema6.fields.string({
			nullable: true,
		}),
		session: schema6.fields.object({
			nullable: true,
			properties: {
				startedAt: schema6.fields.number({
					default: () => Date.now(),
				}),
				completedInstructions: schema6.fields.array({
					items: schema6.fields.string(),
				}),
				completedIngredients: schema6.fields.array({
					items: schema6.fields.string(),
				}),
				instructionAssignments: schema6.fields.map({
					values: schema6.fields.string(),
				}),
				ingredientAssignments: schema6.fields.map({
					values: schema6.fields.string(),
				}),
			},
		}),
		/**
		 * String literal tags. Recipes can be filtered by tags.
		 * Before assigning, tags should always be made lowercase.
		 */
		tags: schema6.fields.array({
			items: schema6.fields.string(),
		}),
		mainImage: schema6.fields.file({
			nullable: true,
		}),
		cookCount: schema6.fields.number({
			default: 0,
		}),
		lastCookedAt: schema6.fields.number({
			nullable: true,
		}),
		lastAddedAt: schema6.fields.number({
			nullable: true,
		}),
		addIntervalGuess: schema6.fields.number({
			nullable: true,
		}),
		pinnedAt: schema6.fields.number({
			nullable: true,
		}),
	},
	indexes: {
		slug: {
			field: 'slug',
		},
		updatedAt: {
			field: 'updatedAt',
		},
		pinnedAt: {
			field: 'pinnedAt',
		},
		// makes tags indexable individually
		tag: {
			type: 'string[]',
			compute: (recipe) => {
				return recipe.tags;
			},
		},
		// similar algorithm to food recommendation engine,
		// but only tracking adding to shopping list
		suggestAfter: {
			type: 'number',
			compute: (recipe) => {
				if (
					!recipe.lastAddedAt ||
					!recipe.addIntervalGuess ||
					recipe.cookCount < 2
				)
					return Number.MAX_SAFE_INTEGER;
				return recipe.lastAddedAt + recipe.addIntervalGuess;
			},
		},
		food: {
			type: 'string[]',
			compute: (recipe) => {
				return recipe.ingredients
					.map((i) => i.food)
					.filter((f) => !!f)
					.map((f) => f.toLowerCase());
			},
		},
		titleMatch: {
			type: 'string[]',
			compute: (recipe) => fullTextIndex(recipe.title),
		},
		sessionStartedAt: {
			type: 'number',
			compute: (recipe) => {
				return recipe.session?.startedAt || 0;
			},
		},
	},
});

// src/schema/recipeTagMetadata.ts
import { schema as schema7 } from '@verdant-web/common';
var recipeTagMetadata = schema7.collection({
	name: 'recipeTagMetadata',
	primaryKey: 'name',
	pluralName: 'recipeTagMetadata',
	fields: {
		name: schema7.fields.string(),
		color: schema7.fields.string({
			nullable: true,
		}),
		icon: schema7.fields.string({
			nullable: true,
		}),
	},
});

// src/schema.ts
var schema_default = schema8({
	version: 41,
	collections: {
		categories,
		items,
		foods,
		lists,
		collaborationInfo,
		recipes,
		recipeTagMetadata,
	},
});
export { schema_default as default };
