import cuid from 'cuid';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from '@aglio/tools';
import { parseIngredient } from '@aglio/conversion';
import {
	EntityShape,
	Presence,
	ClientDescriptor,
	Item,
} from './client/index.js';
import { createHooks } from './client/react.js';
import { migrations } from './migrations.js';
import schema from './schema.js';
import { API_HOST_HTTP, API_ORIGIN, SECURE } from '@/config.js';
import { trpcClient } from '@/trpc.js';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-hot-toast';

export type { Item, Category, FoodCategoryAssignment } from './client/index.js';

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

const _groceriesDesc = new ClientDescriptor({
	sync: {
		authEndpoint: `${API_HOST_HTTP}/api/auth/lofi`,
		initialPresence: {} as Presence,
	},
	schema,
	migrations,
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
	undo: async () => {
		(await _groceries).undoHistory.undo();
	},
	redo: async () => {
		(await _groceries).undoHistory.redo();
	},

	deleteItem: async (item: Item) => {
		return (await _groceries).items.delete(item.get('id'));
	},
	deleteItems: async (ids: string[]) => {
		const storage = await _groceries;
		return storage.items.deleteAll(ids);
	},
	setItemPurchasedQuantity: async (item: Item, quantity: number) => {
		item.set('purchasedQuantity', quantity);
		(await _groceries).presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	// TODO: incorporate this kind of advanced upsert into lofi
	upsertFoodCategoryAssignment: async (food: string, categoryId: string) => {
		const allExisting = await (
			await _groceries
		).foodCategoryAssignments.findAll({
			where: 'foodName',
			equals: food,
		}).resolved;
		const existing = allExisting?.find((a) => a.get('remote') === false);
		if (existing) {
			existing.set('categoryId', categoryId);
		} else {
			await (
				await _groceries
			).foodCategoryAssignments.create({
				id: cuid(),
				foodName: food,
				categoryId,
				remote: false,
			});
		}

		// send the categorization to the server for research
		await trpcClient.mutation('categories.assign', {
			foodName: food,
			categoryId,
		});
	},
	setItemPosition: async (item: Item, sortKey: string, categoryId?: string) => {
		const storage = await _groceries;
		item.set('sortKey', sortKey);
		if (categoryId) {
			item.set('categoryId', categoryId);
		}
		// if category changed, update lookups
		if (categoryId) {
			await groceries.upsertFoodCategoryAssignment(
				item.get('food'),
				categoryId,
			);
		}

		storage.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	toggleItemPurchased: async (item: Item) => {
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
		item: Item,
		updates: Omit<Partial<EntityShape<Item>>, 'inputs'>,
	) => {
		item.update(updates);
		(await _groceries).presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	setItemCategory: async (item: Item, categoryId: string) => {
		const storage = await _groceries;
		item.set('categoryId', categoryId);
		await groceries.upsertFoodCategoryAssignment(item.get('food'), categoryId);
		storage.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	createCategory: async (name: string) => {
		return (await _groceries).categories.create({
			name,
		});
	},
	resetCategoriesToDefault: async () => {
		const storage = await _groceries;
		const defaultCategories = await trpcClient.query('categories.defaults');
		const existingCategories = await storage.categories.findAll().resolved;
		for (const cat of existingCategories) {
			await groceries.deleteCategory(cat.get('id'));
		}
		for (const cat of defaultCategories) {
			await storage.categories.upsert({
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
		const defaultCategory = await storage.categories.upsert({
			id: DEFAULT_CATEGORY,
			name: DEFAULT_CATEGORY,
		});

		let lastItemId: string | null = null;

		for (const line of lines) {
			const parsed = parseIngredient(line);
			const firstMatch = await storage.items.findOne({
				where: 'food',
				equals: parsed.food,
			}).resolved;
			if (firstMatch) {
				const itemId = firstMatch.get('id');
				const totalQuantity = firstMatch.get('totalQuantity') + parsed.quantity;
				firstMatch.set('totalQuantity', totalQuantity);
				// add the source, too
				const inputs = firstMatch.get('inputs');
				inputs.push({
					text: line,
					url: sourceInfo?.url || null,
					title: sourceInfo?.title || null,
				});
				lastItemId = itemId;
			} else {
				const lookups = await storage.foodCategoryAssignments.findAll({
					where: 'foodName',
					equals: parsed.food,
				}).resolved;
				// if there are local and remote lookups, use the local one
				const lookup = lookups.find((l) => !l.get('remote')) || lookups[0];
				let categoryId = lookup?.get('categoryId');

				if (!categoryId) {
					try {
						const remoteLookup = await trpcClient.query(
							'categories.assignment',
							parsed.food,
						);
						if (remoteLookup) {
							categoryId = remoteLookup;
						}
					} catch (err) {
						console.error(err);
					}
				}

				// verify the category exists locally
				const category = categoryId
					? await storage.categories.get(categoryId).resolved
					: null;
				if (!category) {
					categoryId = defaultCategory.get('id');
				}

				// TODO: findOne with a sort order applied to get just
				// the last item
				const categoryItems = await storage.items.findAll({
					where: 'categoryId_sortKey',
					match: {
						categoryId,
					},
					order: 'desc',
					// TODO: when limits exist, limit to 1
				}).resolved;
				const lastCategoryItem = categoryItems[0];

				const item = await storage.items.create({
					categoryId,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
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
				lastItemId = item.get('id');
			}
		}

		if (lastItemId) {
			storage.presence.update({
				lastInteractedItem: lastItemId,
			});
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
		const matchingItems = await storage.items.findAll({
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		// move all items to the default category
		for (const item of matchingItems) {
			item.set('categoryId', DEFAULT_CATEGORY);
		}
		// delete all lookups for this category locally
		const lookups = await storage.foodCategoryAssignments.findAll({
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		for (const lookup of lookups) {
			storage.foodCategoryAssignments.delete(lookup.get('id'));
		}

		storage.categories.delete(categoryId);
	},
};

// hook up undo to ctrl+z
document.addEventListener('keydown', async (e) => {
	if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
		e.preventDefault();
		const result = await (await _groceries).undoHistory.undo();
		if (!result) {
			console.log('Nothing to undo');
		}
	}
	if (
		(e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
		(e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
	) {
		e.preventDefault();
		const result = await (await _groceries).undoHistory.redo();
		if (!result) {
			console.log('Nothing to redo');
		}
	}
});
