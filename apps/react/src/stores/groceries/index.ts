import cuid from 'cuid';
import { parseIngredient } from '@aglio/conversion';
import {
	EntityShape,
	ClientDescriptor,
	Item,
	ItemInputsItemInit,
	ItemDestructured,
	createHooks,
	migrations,
	UserInfo,
} from '@aglio/groceries-client';
import { API_HOST_HTTP, API_ORIGIN, SECURE } from '@/config.js';
import { trpcClient } from '@/trpc.js';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-hot-toast';

export interface Presence {
	lastInteractedItem: string | null;
	viewingRecipeId: string | null;
}

export interface Profile {
	id: string;
	name: string;
	imageUrl?: string;
}

export type Person = UserInfo<Profile, Presence>;

export const hooks = createHooks<Presence, Profile>();

export const groceriesDescriptor = new ClientDescriptor<Presence, Profile>({
	sync: {
		authEndpoint: `${API_HOST_HTTP}/api/lofi/groceries`,
		initialPresence: {
			lastInteractedItem: null,
			viewingRecipeId: null,
		},
		defaultProfile: {
			id: '',
			name: '',
		},
	},
	migrations,
	namespace: 'groceries',
	log: import.meta.env.DEV
		? (...args) => console.debug('🎧', ...args)
		: undefined,
	disableRebasing: true,
});
(window as any).groceriesDescriptor = groceriesDescriptor;
const _groceries = groceriesDescriptor.open();

(window as any).stats = async () => {
	(await _groceries).stats().then(console.info);
};
_groceries.then((g) => {
	(window as any).groceries = g;
});

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
	// TODO: incorporate this kind of advanced upsert into lofi?
	upsertFoodCategoryAssignment: async (
		food: string,
		categoryId: string | null,
	) => {
		// send the categorization to the server for research
		if (categoryId) {
			try {
				await trpcClient.categories.assign.mutate({
					foodName: food,
					categoryId,
				});
			} catch (err) {
				console.error(err);
			}
		}

		const storage = await _groceries;
		const existing = await storage.foods.findOne({
			where: 'nameLookup',
			equals: food,
		}).resolved;
		if (existing) {
			if (categoryId) {
				storage
					.batch({ undoable: false })
					.run(() => {
						existing.set('categoryId', categoryId);
					})
					.flush();
			}
		} else if (categoryId) {
			try {
				const remoteLookup = await trpcClient.food.data.query(food);
				if (remoteLookup) {
					await storage.foods.put(
						{
							canonicalName: remoteLookup.canonicalName,
							categoryId,
							isPerishable: remoteLookup.isPerishable,
							isStaple: !!remoteLookup.isStaple,
							alternateNames: remoteLookup.alternateNames,
						},
						{ undoable: false },
					);
				}
			} catch (err) {
				console.error(err);
			}
		}
	},

	toggleItemPurchased: async (item: Item) => {
		const storage = await _groceries;
		if (item.get('purchasedAt')) {
			item.set('purchasedAt', null);
		} else {
			await groceries.purchaseItem(item);
		}
		storage.sync.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	purchaseItem: async (item: Item) => {
		const storage = await _groceries;
		// also set expiration based on food info
		const food = await storage.foods.findOne({
			where: 'nameLookup',
			equals: item.get('food'),
		}).resolved;
		const expirationDays = food?.get('expiresAfterDays');
		item.set('purchasedAt', Date.now());
		if (expirationDays) {
			item.set('expiresAt', Date.now() + expirationDays * 24 * 60 * 60 * 1000);
		}
	},
	purchaseItems: async (items: Item[]) => {
		for (const item of items) {
			await groceries.purchaseItem(item);
		}
	},
	updateItem: async (
		item: Item,
		updates: Omit<Partial<ItemDestructured>, 'inputs'>,
	) => {
		item.update(updates);
		(await _groceries).sync.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	setItemCategory: async (
		item: Item,
		categoryId: string | null,
		updateAssignment = false,
	) => {
		const storage = await _groceries;
		item.set('categoryId', categoryId);
		if (updateAssignment) {
			await groceries.upsertFoodCategoryAssignment(
				item.get('food'),
				categoryId,
			);
		}
		storage.sync.presence.update({
			lastInteractedItem: item.get('id'),
		});
	},
	createCategory: async (name: string) => {
		return (await _groceries).categories.put({
			name,
		});
	},
	resetCategoriesToDefault: async () => {
		const storage = await _groceries;
		const defaultCategories = await trpcClient.categories.defaults.query();
		const existingCategories = await storage.categories.findAll().resolved;
		const existingIdsToDelete = existingCategories
			.map((cat) => cat.get('id'))
			.filter((id) => !defaultCategories.find((cat) => cat.id === id));
		await storage.categories.deleteAll(existingIdsToDelete);
		for (const cat of defaultCategories) {
			await storage.categories.put({
				id: cat.id,
				name: cat.name,
				sortKey: cat.sortKey,
			});
		}
	},
	addItems: async (
		lines: (
			| string
			| {
					original: string;
					quantity: number;
					unit: string | null;
					food: string;
			  }
		)[],
		{
			sourceInfo,
			listId = null,
		}: {
			listId?: string | null;
			sourceInfo?: Omit<ItemInputsItemInit, 'text' | 'quantity'>;
		},
	) => {
		const storage = await _groceries;
		if (!lines.length) return;

		let lastItemId: string | null = null;

		for (const line of lines) {
			if (typeof line === 'string' && !line.trim()) continue;
			const parsed = typeof line === 'string' ? parseIngredient(line) : line;
			const firstMatch = await storage.items.findOne({
				where: 'purchased_food_listId',
				match: {
					purchased: 'no',
					food: parsed.food,
					listId: listId || 'null',
				},
				order: 'asc',
			}).resolved;
			if (firstMatch) {
				const itemId = firstMatch.get('id');
				const totalQuantity = firstMatch.get('totalQuantity') + parsed.quantity;
				firstMatch.set('totalQuantity', totalQuantity);
				// add the source, too
				const inputs = firstMatch.get('inputs');
				inputs.push({
					...sourceInfo,
					text: parsed.original,
				});
				lastItemId = itemId;
			} else {
				const lookup = await storage.foods.findOne({
					where: 'nameLookup',
					equals: parsed.food,
				}).resolved;
				let categoryId: string | null = lookup?.get('categoryId') ?? null;

				if (!categoryId) {
					try {
						const remoteLookup = await trpcClient.food.data.query(parsed.food);
						if (remoteLookup) {
							await storage.foods.put({
								canonicalName: remoteLookup.canonicalName,
								categoryId: remoteLookup.categoryId,
								isPerishable: remoteLookup.isPerishable,
								isStaple: !!remoteLookup.isStaple,
								alternateNames: remoteLookup.alternateNames,
							});
							categoryId = remoteLookup.categoryId;
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
					categoryId = null;
				}

				const item = await storage.items.put({
					categoryId,
					listId: listId || null,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					unit: parsed.unit || '',
					food: parsed.food,
					inputs: [
						{
							...sourceInfo,
							text: parsed.original,
							quantity: parsed.quantity,
						},
					],
				});
				lastItemId = item.get('id');
			}

			// increment usage count for this food
			const matchingSuggestion = await storage.suggestions.get(parsed.food)
				.resolved;
			if (matchingSuggestion) {
				storage
					.batch({ undoable: false })
					.run(() => {
						matchingSuggestion.set(
							'usageCount',
							matchingSuggestion.get('usageCount') + 1,
						);
					})
					.flush();
			} else {
				await storage.suggestions.put(
					{
						text: parsed.food,
						usageCount: 1,
					},
					{ undoable: false },
				);
			}
		}

		if (lastItemId) {
			storage.sync.presence.update({
				lastInteractedItem: lastItemId,
			});
		}
	},
	cloneItem: async (item: Item) => {
		const storage = await _groceries;
		const { id, purchasedAt, expiresAt, ...snapshot } = item.getSnapshot();
		// make a clone of the remaining data
		// FIXME: lo-fi should not reuse oids on puts
		const clone = JSON.parse(JSON.stringify(snapshot));
		const newItem = await storage.items.put(clone);
		return newItem;
	},
	deleteCategory: async (categoryId: string) => {
		const storage = await _groceries;
		const matchingItems = await storage.items.findAll({
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		// move all items to the default category
		for (const item of matchingItems) {
			item.set('categoryId', null);
		}
		// delete all lookups for this category locally
		const lookups = await storage.foods.findAll({
			where: 'categoryId',
			equals: categoryId,
		}).resolved;
		for (const lookup of lookups) {
			lookup.set('categoryId', null);
		}

		storage.categories.delete(categoryId);
	},
	deleteList: async (listId: string) => {
		const storage = await _groceries;
		const matchingItems = await storage.items.findAll({
			where: 'listId',
			equals: listId,
		}).resolved;
		for (const item of matchingItems) {
			item.set('listId', null);
		}
		storage.lists.delete(listId);
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
