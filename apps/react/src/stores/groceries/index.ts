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
	Client,
} from '@aglio/groceries-client';
import { API_HOST_HTTP, API_ORIGIN, SECURE } from '@/config.js';
import { trpcClient } from '@/trpc.js';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

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

export const hooks = createHooks<Presence, Profile>().withMutations({
	useDeleteItem: (client) => {
		return useCallback((item: Item) => {
			return client.items.delete(item.get('id'));
		}, []);
	},
	useDeleteItems: (client) =>
		useCallback((ids: string[]) => client.items.deleteAll(ids), [client]),
	useUpsertFoodCategoryAssignment: (client) =>
		useCallback(
			async (food: string, categoryId: string | null) => {
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

				const existing = await client.foods.findOne({
					where: 'nameLookup',
					equals: food,
				}).resolved;
				if (existing) {
					if (categoryId) {
						client
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
							await client.foods.put(
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
			[client],
		),
	useToggleItemPurchased: (client) => {
		const purchaseItem = hooks.usePurchaseItem();
		return useCallback(
			async (item: Item) => {
				if (item.get('purchasedAt')) {
					item.set('purchasedAt', null);
				} else {
					await purchaseItem(item);
				}
				client.sync.presence.update({
					lastInteractedItem: item.get('id'),
				});
			},
			[client],
		);
	},
	usePurchaseItem: (client) =>
		useCallback(
			async (item: Item) => {
				// also set expiration based on food info
				const food = await client.foods.findOne({
					where: 'nameLookup',
					equals: item.get('food'),
				}).resolved;
				const expirationDays = food?.get('expiresAfterDays');
				const now = Date.now();
				item.set('purchasedAt', now);
				if (expirationDays) {
					item.set('expiresAt', now + expirationDays * 24 * 60 * 60 * 1000);
				}
				if (food) {
					client
						.batch({ undoable: false })
						.run(() => {
							const previousPurchasedAt = food.get('lastPurchasedAt');
							food.set('lastPurchasedAt', now);
							const currentGuess = food.get('purchaseIntervalGuess') || 0;
							if (previousPurchasedAt) {
								const newGuess = (currentGuess + now - previousPurchasedAt) / 2;
								food.set('purchaseIntervalGuess', newGuess);
							}
						})
						.flush();
				}
			},
			[client],
		),
	usePurchaseItems: (client) => {
		const purchaseItem = hooks.usePurchaseItem();
		return useCallback(
			async (items: Item[]) => {
				for (const item of items) {
					await purchaseItem(item);
				}
			},
			[client],
		);
	},
	useUpdateItem: (client) =>
		useCallback(
			async (
				item: Item,
				updates: Omit<Partial<ItemDestructured>, 'inputs'>,
			) => {
				item.update(updates);
				client.sync.presence.update({
					lastInteractedItem: item.get('id'),
				});
			},
			[client],
		),
	useSetItemCategory: (client) => {
		const upsertFoodCategoryAssignment =
			hooks.useUpsertFoodCategoryAssignment();
		return useCallback(
			async (
				item: Item,
				categoryId: string | null,
				updateAssignment = false,
			) => {
				item.set('categoryId', categoryId);
				if (updateAssignment) {
					await upsertFoodCategoryAssignment(item.get('food'), categoryId);
				}
				client.sync.presence.update({
					lastInteractedItem: item.get('id'),
				});
			},
			[client],
		);
	},
	useCreateCategory: (client) =>
		useCallback(
			async (name: string) => {
				return client.categories.put({
					name,
				});
			},
			[client],
		),
	useResetCategoriesToDefault: (client) =>
		useCallback(async () => {
			const defaultCategories = await trpcClient.categories.defaults.query();
			const existingCategories = await client.categories.findAll().resolved;
			const existingIdsToDelete = existingCategories
				.map((cat) => cat.get('id'))
				.filter((id) => !defaultCategories.find((cat) => cat.id === id));
			await client.categories.deleteAll(existingIdsToDelete);
			for (const cat of defaultCategories) {
				await client.categories.put({
					id: cat.id,
					name: cat.name,
					sortKey: cat.sortKey,
				});
			}
		}, [client]),
	useAddItems: (client) =>
		useCallback(
			async (
				lines: (
					| string
					| {
							original: string;
							quantity: number;
							unit: string | null;
							food: string;
					  }
				)[],
				data: {
					listId?: string | null;
					sourceInfo?: Omit<ItemInputsItemInit, 'text' | 'quantity'>;
				},
			) => {
				return addItems(client, lines, data);
			},
			[client],
		),
	useCloneItem: (client) =>
		useCallback(
			async (item: Item) => {
				const { id, purchasedAt, expiresAt, ...snapshot } = item.getSnapshot();
				// make a clone of the remaining data
				const clone = JSON.parse(JSON.stringify(snapshot));
				const newItem = await client.items.put(clone);
				return newItem;
			},
			[client],
		),
	useDeleteCategory: (client) =>
		useCallback(
			async (categoryId: string) => {
				const matchingItems = await client.items.findAll({
					where: 'categoryId',
					equals: categoryId,
				}).resolved;
				// move all items to the default category
				for (const item of matchingItems) {
					item.set('categoryId', null);
				}
				// delete all lookups for this category locally
				const lookups = await client.foods.findAll({
					where: 'categoryId',
					equals: categoryId,
				}).resolved;
				for (const lookup of lookups) {
					lookup.set('categoryId', null);
				}

				client.categories.delete(categoryId);
			},
			[client],
		),
	useDeleteList: (client) =>
		useCallback(
			async (listId: string) => {
				const matchingItems = await client.items.findAll({
					where: 'listId',
					equals: listId,
				}).resolved;
				for (const item of matchingItems) {
					item.set('listId', null);
				}
				await client.lists.delete(listId);
			},
			[client],
		),
	useDeleteRecipe: (client) =>
		useCallback(
			async (recipeId: string) => {
				await client.recipes.delete(recipeId);
			},
			[client],
		),
});

export function createClientDescriptor(options: { namespace: string }) {
	return new ClientDescriptor<Presence, Profile>({
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
		namespace: options.namespace,
		log: import.meta.env.DEV
			? (...args) => console.debug('🎧', ...args)
			: undefined,
	});
}

export const groceriesDescriptor = createClientDescriptor({
	namespace: 'groceries',
});
(window as any).groceriesDescriptor = groceriesDescriptor;
const _groceries = groceriesDescriptor.open();

(window as any).stats = async () => {
	(await _groceries).stats().then(console.info);
};
_groceries.then((g) => {
	(window as any).groceries = g;
});

export async function addItems(
	client: Client,
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
) {
	if (!lines.length) return;

	let lastItemId: string | null = null;

	for (const line of lines) {
		if (typeof line === 'string' && !line.trim()) continue;
		const parsed = typeof line === 'string' ? parseIngredient(line) : line;
		const firstMatch = await client.items.findOne({
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
			const lookup = await client.foods.findOne({
				where: 'nameLookup',
				equals: parsed.food,
			}).resolved;
			let categoryId: string | null = lookup?.get('categoryId') ?? null;

			if (!categoryId) {
				try {
					const remoteLookup = await trpcClient.food.data.query(parsed.food);
					if (remoteLookup) {
						await client.foods.put({
							canonicalName: remoteLookup.canonicalName,
							categoryId: remoteLookup.categoryId,
							isPerishable: remoteLookup.isPerishable,
							isStaple: !!remoteLookup.isStaple,
							alternateNames: remoteLookup.alternateNames,
							lastAddedAt: Date.now(),
							purchaseCount: 1,
						});
						categoryId = remoteLookup.categoryId;
					}
				} catch (err) {
					console.error(err);
				}
			} else {
				lookup.set('lastAddedAt', Date.now());
				lookup.set('purchaseCount', lookup.get('purchaseCount') + 1);
			}

			// verify the category exists locally
			const category = categoryId
				? await client.categories.get(categoryId).resolved
				: null;
			if (!category) {
				categoryId = null;
			}

			const item = await client.items.put({
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
		const matchingSuggestion = await client.suggestions.get(parsed.food)
			.resolved;
		if (matchingSuggestion) {
			client
				.batch({ undoable: false })
				.run(() => {
					matchingSuggestion.set(
						'usageCount',
						matchingSuggestion.get('usageCount') + 1,
					);
				})
				.flush();
		} else {
			await client.suggestions.put(
				{
					text: parsed.food,
					usageCount: 1,
				},
				{ undoable: false },
			);
		}
	}

	if (lastItemId) {
		client.sync.presence.update({
			lastInteractedItem: lastItemId,
		});
	}
}

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
