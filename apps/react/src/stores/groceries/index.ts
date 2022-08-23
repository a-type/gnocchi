import cuid from 'cuid';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from '@aglio/tools';
import { parseIngredient } from '@aglio/conversion';
import {
	collection,
	createHooks,
	storage,
	StorageDocument,
} from '@aglio/storage';
import { NaiveTimestampProvider } from '@aglio/storage-common';

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
});
export type GroceryCategory = StorageDocument<typeof categoryCollection>;

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
});
export type FoodCategoryLookup = StorageDocument<
	typeof foodCategoryLookupCollection
>;

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
						indexed: false,
						unique: false,
					},
				},
			},
		},
	},
	synthetics: {
		purchased: {
			type: '#string',
			indexed: true,
			unique: false,
			compute: (doc) =>
				doc.purchasedQuantity >= doc.totalQuantity ? 'yes' : 'no',
		},
	},
});
export type GroceryItem = StorageDocument<typeof itemCollection>;

const DEFAULT_CATEGORY = 'None';

const _groceries = storage({
	syncOptions: {
		host: 'ws://localhost:3001',
		timestampProvider: new NaiveTimestampProvider(),
	},
	schema: {
		version: 1,
		collections: {
			items: itemCollection,
			categories: categoryCollection,
			foodCategoryLookups: foodCategoryLookupCollection,
		},
	},
});

(window as any).stats = () => {
	_groceries.stats().then(console.info);
};

export const hooks = createHooks(_groceries);

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
	toggleItemPurchased: (item: GroceryItem) => {
		if (item.purchasedQuantity >= item.totalQuantity) {
			return _groceries.get('items').update(item.id, {
				purchasedQuantity: 0,
			});
		} else {
			return _groceries.get('items').update(item.id, {
				purchasedQuantity: item.totalQuantity,
			});
		}
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
				foodName: item.food,
				categoryId,
			}),
		]);
	},
	createCategory: (name: string) => {
		return _groceries.get('categories').create({
			id: cuid(),
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
			const items = _groceries.get('items');
			const firstMatch = await _groceries.get('items').findOne({
				where: 'food',
				equals: parsed.food,
			}).resolved;
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
					id: cuid(),
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
