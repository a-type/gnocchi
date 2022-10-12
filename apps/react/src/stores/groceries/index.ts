import cuid from 'cuid';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from '@aglio/tools';
import { parseIngredient } from '@aglio/conversion';
import {
	EntityShape,
	Presence,
	StorageDescriptor,
	WebsocketSync,
} from '@lo-fi/web';
import { createHooks } from '@lo-fi/react';
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

declare module '@lo-fi/web' {
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

const _groceriesDesc = new StorageDescriptor({
	sync: new WebsocketSync({
		host: `ws${SECURE ? 's' : ''}://${syncOrigin}`,
	}),
	schema,
	migrations,
	initialPresence: {} as Presence,
	namespace: 'groceries',
});
const _groceries = _groceriesDesc.open();

(window as any).stats = async () => {
	(await _groceries).stats().then(console.info);
};
_groceries.then((g) => {
	(window as any).groceries = g;
});

export const hooks = createHooks(_groceriesDesc);

export const groceries = {
	deleteItem: async (item: GroceryItem) => {
		return (await _groceries).delete('items', item.get('id'));
	},
	deleteItems: async (ids: string[]) => {
		const storage = await _groceries;
		for (const id of ids) {
			return storage.delete('items', id);
		}
	},
	setItemPurchasedQuantity: async (item: GroceryItem, quantity: number) => {
		item.set('purchasedQuantity', quantity);
		(await _groceries).presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	setItemPosition: async (
		item: GroceryItem,
		sortKey: string,
		categoryId?: string,
	) => {
		const storage = await _groceries;
		item.set('sortKey', sortKey);
		item.set('categoryId', categoryId);
		// if category changed, update lookups
		if (categoryId) {
			// FIXME: upserting assignments
			// (await _groceries).create('foodCategoryAssignments', {
			// 	id: cuid(),
			// 	foodName: item.food,
			// 	categoryId,
			// 	remote: false,
			// });
		}

		storage.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	toggleItemPurchased: async (item: GroceryItem) => {
		const storage = await _groceries;
		if (item.get('purchasedQuantity') >= item.get('totalQuantity')) {
			item.set('purchasedQuantity', 0);
		} else {
			item.set('purchasedQuantity', item.get('totalQuantity'));
		}
		storage.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	updateItem: async (
		item: GroceryItem,
		updates: Omit<Partial<EntityShape<GroceryItem>>, 'inputs'>,
	) => {
		item.update(updates);
		(await _groceries).presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	setItemCategory: async (item: GroceryItem, categoryId: string) => {
		const storage = await _groceries;
		item.set('categoryId', categoryId);
		// FIXME: upserting assignments
		// storage.create('foodCategoryAssignments', {
		// 	id: cuid(),
		// 	foodName: item.food,
		// 	categoryId,
		// 	remote: false,
		// })
		storage.presence.update({
			lastInteractedItem: item.get('id'),
		});

		// send the categorization to the server for research
		await trpcClient.mutation('categories.assign', {
			foodName: item.get('food'),
			categoryId,
		});
	},
	createCategory: async (name: string) => {
		return (await _groceries).create('categories', {
			id: cuid(),
			name,
		});
	},
	resetCategoriesToDefault: async () => {
		const storage = await _groceries;
		const defaultCategories = await trpcClient.query('categories.defaults');
		const existingCategories = await storage.findAll('categories').resolved;
		for (const cat of existingCategories) {
			await groceries.deleteCategory(cat.get('id'));
		}
		for (const cat of defaultCategories) {
			await storage.upsert('categories', {
				id: cat.id,
				name: cat.name,
			});
		}
	},
	addItems: async (
		lines: string[],
		sourceInfo?: { url?: string; title: string },
	) => {
		const storage = await _groceries;
		if (!lines.length) return;
		const defaultCategory = await storage.upsert('categories', {
			id: DEFAULT_CATEGORY,
			name: DEFAULT_CATEGORY,
		});

		for (const line of lines) {
			const parsed = parseIngredient(line);
			let itemId: string;
			const firstMatch = await storage.findOne('items', {
				where: 'food',
				equals: parsed.food,
			}).resolved;
			if (firstMatch) {
				itemId = firstMatch.get('id');
				const totalQuantity = firstMatch.get('totalQuantity') + parsed.quantity;
				firstMatch.set('totalQuantity', totalQuantity);
			} else {
				itemId = cuid();

				const lookups = await storage.findAll('foodCategoryAssignments', {
					where: 'foodName',
					equals: parsed.food,
				}).resolved;
				// if there are local and remote lookups, use the local one
				const lookup = lookups.find((l) => !l.get('remote')) || lookups[0];
				let categoryId = lookup?.get('categoryId') ?? defaultCategory.get('id');

				// verify the category exists locally
				const category = await storage.get('categories', categoryId).resolved;
				if (!category) {
					categoryId = defaultCategory.get('id');
				}

				// TODO: findOne with a sort order applied to get just
				// the last item
				const categoryItems = await storage.findAll('items', {
					where: 'categoryId_sortKey',
					match: {
						categoryId,
					},
					order: 'desc',
					// TODO: when limits exist, limit to 1
				}).resolved;
				const lastCategoryItem = categoryItems[0];

				await storage.create('items', {
					id: cuid(),
					categoryId,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					purchasedQuantity: 0,
					unit: parsed.unit,
					food: parsed.food,
					sortKey: generateKeyBetween(
						lastCategoryItem?.get('sortKey') ?? null,
						null,
					),
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
		const storage = await _groceries;
		const matchingItems = await storage.findAll('items', {
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		// move all items to the default category
		for (const item of matchingItems) {
			item.set('categoryId', DEFAULT_CATEGORY);
		}
		// delete all lookups for this category locally
		const lookups = await storage.findAll('foodCategoryAssignments', {
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		for (const lookup of lookups) {
			storage.delete('foodCategoryAssignments', lookup.get('id'));
		}

		storage.delete('categories', categoryId);
	},
	syncDefaultFoodAssignments: async () => {
		const storage = await _groceries;
		trpcClient.query('categories.assignments', null).then((assignments) => {
			for (const assignment of assignments) {
				storage.upsert('foodCategoryAssignments', {
					id: assignment.id,
					foodName: assignment.foodName,
					categoryId: assignment.categoryId,
					remote: true,
				});
			}
		});
	},
};

// on startup, sync assignments
// groceries.syncDefaultFoodAssignments();
