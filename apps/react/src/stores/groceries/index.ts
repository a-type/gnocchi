import cuid from 'cuid';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from '@aglio/tools';
import { parseIngredient } from '@aglio/conversion';
import { Presence, Storage } from '@aglio/storage';
import { createHooks } from '@aglio/storage-react';
import { schema, GroceryItem, migrations } from './schema/schema.js';
import { API_ORIGIN, SECURE } from '@/config.js';
import { trpcClient } from '@/trpc.js';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-hot-toast';

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
			_groceries.get('foodCategoryAssignments').upsert({
				id: cuid(),
				foodName: item.food,
				categoryId,
				remote: false,
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
			_groceries.get('foodCategoryAssignments').upsert({
				id: cuid(),
				foodName: item.food,
				categoryId,
				remote: false,
			}),
		]);
		groceries.presence.update({
			lastInteractedItem: item.id,
		});

		// send the categorization to the server for research
		await trpcClient.mutation('categories.assign', {
			foodName: item.food,
			categoryId,
		});
	},
	createCategory: (name: string) => {
		return _groceries.get('categories').create({
			id: cuid(),
			name,
		});
	},
	resetCategoriesToDefault: async () => {
		const defaultCategories = await trpcClient.query('categories.defaults');
		const existingCategories = await _groceries.get('categories').getAll()
			.resolved;
		for (const cat of existingCategories) {
			await groceries.deleteCategory(cat.id);
		}
		for (const cat of defaultCategories) {
			await _groceries.get('categories').upsert({
				id: cat.id,
				name: cat.name,
			});
		}
	},
	addItems: async (
		lines: string[],
		sourceInfo?: { url?: string; title: string },
	) => {
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

				const lookups = await _groceries.get('foodCategoryAssignments').getAll({
					where: 'foodName',
					equals: parsed.food,
				}).resolved;
				// if there are local and remote lookups, use the local one
				const lookup = lookups.find((l) => !l.remote) || lookups[0];
				let categoryId = lookup?.categoryId ?? defaultCategory.id;

				// verify the category exists locally
				const category = await _groceries.get('categories').get(categoryId)
					.resolved;
				if (!category) {
					categoryId = defaultCategory.id;
				}

				// TODO: findOne with a sort order applied to get just
				// the last item
				const categoryItems = await _groceries.get('items').getAll({
					where: 'categoryId_sortKey',
					match: {
						categoryId,
					},
					order: 'desc',
					// TODO: when limits exist, limit to 1
				}).resolved;
				const lastCategoryItem = categoryItems[0];

				await _groceries.get('items').create({
					id: cuid(),
					categoryId,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					purchasedQuantity: 0,
					unit: parsed.unit,
					food: parsed.food,
					sortKey: generateKeyBetween(lastCategoryItem?.sortKey ?? null, null),
					inputs: [
						{
							text: line,
							url: sourceInfo?.url || null,
							title: sourceInfo?.title || null,
						},
					],
				});
			}
			assert(itemId);
		}
	},
	addRecipe: async (url: string) => {
		try {
			const scanned = await trpcClient.query('scans.recipe', {
				url,
			});
			if (scanned.rawIngredients) {
				await groceries.addItems(scanned.rawIngredients, {
					url,
					title: scanned.title || 'Recipe',
				});
			} else if (scanned.detailedIngredients) {
				await groceries.addItems(
					scanned.detailedIngredients.map((i) => i.original),
					{
						url,
						title: scanned.title || 'Recipe',
					},
				);
			}
		} catch (err) {
			if (err instanceof TRPCClientError && err.message === 'FORBIDDEN') {
				// TODO: pop subscription prompt
				toast.error('You must subscribe to add recipe URLs');
			}
		}
	},
	deleteCategory: async (categoryId: string) => {
		if (categoryId === DEFAULT_CATEGORY) {
			return;
		}
		const items = _groceries.get('items');
		const matchingItems = await items.getAll({
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		// move all items to the default category
		for (const item of matchingItems) {
			items.update(item.id, {
				categoryId: DEFAULT_CATEGORY,
			});
		}
		// delete all lookups for this category locally
		const lookups = await _groceries.get('foodCategoryAssignments').getAll({
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		for (const lookup of lookups) {
			_groceries.get('foodCategoryAssignments').delete(lookup.foodName);
		}

		_groceries.get('categories').delete(categoryId);
	},
	syncDefaultFoodAssignments: async () => {
		trpcClient.query('categories.assignments', null).then((assignments) => {
			for (const assignment of assignments) {
				groceries.get('foodCategoryAssignments').upsert({
					id: assignment.id,
					foodName: assignment.foodName,
					categoryId: assignment.categoryId,
					remote: true,
				});
			}
		});
	},
};

export const groceries = Object.assign(_groceries, mutations);
// export const groceries = _groceries;

// on startup, sync assignments
groceries.syncDefaultFoodAssignments();
