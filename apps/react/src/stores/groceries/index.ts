import cuid from 'cuid';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from '@aglio/tools';
import { parseIngredient } from '@aglio/conversion';
import { Presence, Storage } from '@aglio/storage';
import { createHooks } from '@aglio/storage-react';
import { schema, GroceryItem, migrations } from './schema/schema.js';
import { API_ORIGIN, SECURE } from '@/config.js';

export type {
	GroceryItem,
	GroceryCategory,
	FoodCategoryLookup,
} from './schema/schema.js';

declare module '@aglio/storage' {
	export interface Presence {
		lastInteractedItem: string | null;
	}

	export interface Profile {
		id: string;
		name: string;
		imageUrl?: string;
	}
}

const DEFAULT_CATEGORY = 'None';

const syncOrigin = API_ORIGIN || 'localhost:3001';

const _groceries = new Storage({
	syncOptions: {
		host: `ws${SECURE ? 's' : ''}://${syncOrigin}`,
	},
	schema,
	migrations,
	initialPresence: {} as Presence,
});

(window as any).stats = () => {
	_groceries.stats().then(console.info);
};
(window as any).groceries = _groceries;

export const hooks = createHooks(_groceries);

export const mutations = {
	deleteItem: (item: GroceryItem) => {
		return _groceries.get('items').delete(item.id);
	},
	deleteItems: (ids: string[]) => {
		return _groceries.get('items').deleteAll(ids);
	},
	setItemPurchasedQuantity: (item: GroceryItem, quantity: number) => {
		item.$update({
			purchasedQuantity: quantity,
		});
		groceries.presence.update({
			lastInteractedItem: item.id,
		});
	},
	setItemPosition: (
		item: GroceryItem,
		sortKey: string,
		categoryId?: string,
	) => {
		item.$update({
			sortKey,
			categoryId,
		});
		// if category changed, update lookups
		if (categoryId) {
			_groceries.get('foodCategoryLookups').upsert({
				foodName: item.food,
				categoryId,
			});
		}

		groceries.presence.update({
			lastInteractedItem: item.id,
		});
	},
	toggleItemPurchased: async (item: GroceryItem) => {
		if (item.purchasedQuantity >= item.totalQuantity) {
			await _groceries.get('items').update(item.id, {
				purchasedQuantity: 0,
			});
		} else {
			await _groceries.get('items').update(item.id, {
				purchasedQuantity: item.totalQuantity,
			});
		}
		groceries.presence.update({
			lastInteractedItem: item.id,
		});
	},
	updateItem: (
		item: GroceryItem,
		updates: Omit<Partial<GroceryItem>, 'inputs'>,
	) => {
		_groceries.get('items').update(item.id, updates);
		groceries.presence.update({
			lastInteractedItem: item.id,
		});
	},
	setItemCategory: async (item: GroceryItem, categoryId: string) => {
		await Promise.all([
			_groceries.get('items').update(item.id, {
				categoryId,
			}),
			_groceries.get('foodCategoryLookups').upsert({
				foodName: item.food,
				categoryId,
			}),
		]);
		groceries.presence.update({
			lastInteractedItem: item.id,
		});
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
					inputs: [{ text: line }],
				});
			}
			assert(itemId);
		}
	},
};

export const groceries = Object.assign(_groceries, mutations);
// export const groceries = _groceries;
