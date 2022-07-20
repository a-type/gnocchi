import cuid from 'cuid';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from 'lib/assert';
import { parseIngredient } from 'lib/conversion/parseIngredient';
import { collection } from 'lib/storage';
import { createHooks } from 'lib/storage/hooks';
import { storage, Storage } from 'lib/storage/Storage';
import { StorageDocument } from 'lib/storage/types';

const categoryCollection = collection({
	name: 'categories',
	schema: {
		version: 1,
		fields: {
			name: {
				type: 'string',
			},
		},
		synthetics: {},
		indexes: [],
		unique: [],
	},
});
export type GroceryCategory = StorageDocument<typeof categoryCollection>;

const foodCategoryLookupCollection = collection({
	name: 'foodCategoryLookups',
	schema: {
		version: 1,
		fields: {
			categoryId: {
				type: 'string',
			},
		},
		synthetics: {},
		indexes: ['categoryId'],
		unique: [],
	},
});
export type FoodCategoryLookup = StorageDocument<
	typeof foodCategoryLookupCollection
>;

const itemCollection = collection({
	name: 'items',
	schema: {
		version: 1,
		fields: {
			categoryId: {
				type: 'string',
			},
			createdAt: {
				type: 'number',
			},
			totalQuantity: {
				type: 'number',
			},
			purchasedQuantity: {
				type: 'number',
			},
			unit: {
				type: 'string',
			},
			food: {
				type: 'string',
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
					},
				},
			},
		},
		synthetics: {
			purchased: {
				type: '#string',
				compute: (doc) =>
					doc.purchasedQuantity >= doc.totalQuantity ? 'yes' : 'no',
			},
		},
		indexes: ['purchased', 'categoryId', 'food'],
		unique: [],
	},
});
export type GroceryItem = StorageDocument<typeof itemCollection>;

const DEFAULT_CATEGORY = 'None';

const _groceries = storage({
	items: itemCollection,
	categories: categoryCollection,
	foodCategoryLookups: foodCategoryLookupCollection,
});

export const hooks = createHooks(_groceries);
console.log(hooks);

export const mutations = {
	deleteItem: (item: GroceryItem) => {
		return _groceries.get('items').delete(item.id);
	},
	deleteItems: (ids: string[]) => {
		return _groceries.get('items').deleteAll(ids);
	},
	setItemPurchasedQuantity: (item: GroceryItem, quantity: number) => {
		return _groceries.get('items').update(item.id, {
			purchasedQuantity: quantity,
		});
	},
	updateItem: (item: GroceryItem, updates: Partial<GroceryItem>) => {
		return _groceries.get('items').update(item.id, updates);
	},
	setItemCategory: (item: GroceryItem, categoryId: string) => {
		return Promise.all([
			_groceries.get('items').update(item.id, {
				categoryId,
			}),
			_groceries.get('foodCategoryLookups').upsert({
				id: item.food,
				categoryId,
			}),
		]);
	},
	createCategory: (name: string) => {
		return _groceries.get('categories').create({
			name,
		});
	},
	addItems: async (lines: string[]) => {
		if (!lines.length) return;
		const defaultCategory = await _groceries.get('categories').upsert({
			id: DEFAULT_CATEGORY,
			name: DEFAULT_CATEGORY,
		});

		for (const line of lines) {
			const parsed = parseIngredient(line);
			let itemId: string;
			const firstMatch = await _groceries
				.get('items')
				.findOne('food', parsed.food).resolved;
			if (firstMatch) {
				itemId = firstMatch.id;
				const totalQuantity = firstMatch.totalQuantity + parsed.quantity;
				await _groceries.get('items').update(firstMatch.id, {
					totalQuantity,
				});
			} else {
				itemId = cuid();

				const lookup = await _groceries
					.get('foodCategoryLookups')
					.get(parsed.food).resolved;
				const categoryId = lookup?.categoryId ?? defaultCategory.id;

				// TODO: findOne with a sort order applied to get just
				// the last item
				const categoryItems = await _groceries.get('items').getAll({
					where: 'categoryId',
					equals: categoryId,
				}).resolved;
				const lastCategoryItem = categoryItems?.sort((a, b) =>
					a.sortKey < b.sortKey ? -1 : 1,
				)[0];

				await _groceries.get('items').create({
					categoryId,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					purchasedQuantity: 0,
					unit: parsed.unit,
					food: parsed.food,
					sortKey: generateKeyBetween(lastCategoryItem?.sortKey ?? null, null),
					inputs: [],
				});
			}
			assert(itemId);
		}
	},
};

export const groceries = Object.assign(_groceries, mutations);
// export const groceries = _groceries;
