import { pickBestNameMatch } from '@/components/foods/lookup.jsx';
import { signupDialogState } from '@/components/sync/state.js';
import { API_HOST_HTTP } from '@/config.js';
import { detailedInstructionsToDoc, instructionsToDoc } from '@/lib/tiptap.js';
import { trpcClient } from '@/trpc.js';
import { lookupUnit, parseIngredient } from '@aglio/conversion';
import { depluralize } from '@aglio/conversion/src/lib/depluralize.js';
import {
	Client,
	ClientDescriptor,
	Food,
	Item,
	ItemDestructured,
	ItemInputsItemInit,
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItemInit,
	RecipeInit,
	UserInfo,
	createHooks,
	migrations,
} from '@aglio/groceries-client';
import { TRPCClientError } from '@trpc/client';
import cuid from 'cuid';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface Presence {
	lastInteractedItem: string | null;
	viewingRecipeId: string | null;
	lastInteractedCategory: string | null;
}

export interface Profile {
	id: string;
	name: string;
	imageUrl?: string;
}

export type Person = UserInfo<Profile, Presence>;

export const hooks = createHooks<Presence, Profile>().withMutations({
	useDeleteItem: (client) => {
		return useCallback(async (item: Item) => {
			await client.items.delete(item.get('id'));
			client.sync.presence.update({
				lastInteractedItem: item.get('id'),
				lastInteractedCategory: item.get('categoryId') ?? null,
			});
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
					index: {
						where: 'nameLookup',
						equals: food,
					},
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
					lastInteractedCategory: item.get('categoryId') ?? null,
				});
			},
			[client],
		);
	},
	usePurchaseItem: (client) =>
		useCallback(
			async (item: Item, batchName?: string) => {
				// also set expiration based on food info
				const food = await client.foods.findOne({
					index: {
						where: 'anyName',
						equals: item.get('food'),
					},
				}).resolved;

				const now = Date.now();

				client.batch({ batchName }).run(() => {
					item.set('purchasedAt', now);

					if (food) {
						const expiresAfterDays = food.get('expiresAfterDays');
						if (expiresAfterDays) {
							food.set(
								'expiresAt',
								now + expiresAfterDays * 24 * 60 * 60 * 1000,
							);
						}
						const previousPurchaseCount = food.get('purchaseCount');
						const previousPurchasedAt = food.get('lastPurchasedAt');
						food.set('lastPurchasedAt', now);
						food.set('inInventory', true);
						const currentGuess = food.get('purchaseIntervalGuess') || 0;
						if (previousPurchasedAt) {
							const newInterval = now - previousPurchasedAt;
							// reject outliers ... if we've established a baseline
							if (
								previousPurchaseCount < 5 ||
								(newInterval <= 4 * currentGuess &&
									newInterval >= currentGuess / 4)
							) {
								// minium 1 week
								const newGuess = Math.max(
									(currentGuess + newInterval) / 2,
									7 * 24 * 60 * 60 * 1000,
								);
								food.set('purchaseIntervalGuess', newGuess);
							}
						}
						food.set('purchaseCount', previousPurchaseCount + 1);
					}
				});

				if (!food) {
					// TODO: make this a part of the batch above
					await client.foods.put({
						canonicalName: item.get('food'),
						categoryId: item.get('categoryId'),
						alternateNames: [],
						lastPurchasedAt: Date.now(),
						lastAddedAt: item.get('createdAt'),
						purchaseCount: 1,
						defaultListId: item.get('listId'),
						inInventory: true,
					});
				}

				client.sync.presence.update({
					lastInteractedItem: item.get('id'),
					lastInteractedCategory: item.get('categoryId') ?? null,
				});
			},
			[client],
		),
	usePurchaseItems: (client) => {
		const purchaseItem = hooks.usePurchaseItem();
		return useCallback(
			async (items: Item[]) => {
				const batchName = cuid();
				const batch = client.batch({
					batchName,
					timeout: null,
					max: null,
				});
				await Promise.all(items.map((item) => purchaseItem(item, batchName)));
				batch.flush();
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
					lastInteractedCategory: item.get('categoryId'),
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
					lastInteractedCategory: categoryId,
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
					purchased?: boolean;
				} = {},
			) => {
				return addItems(client, lines, data);
			},
			[client],
		),
	useCloneItem: (client) =>
		useCallback(
			async (item: Item) => {
				const { id, purchasedAt, ...snapshot } = item.getSnapshot();
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
					index: {
						where: 'categoryId',
						equals: categoryId,
					},
				}).resolved;
				// move all items to the default category
				for (const item of matchingItems) {
					item.set('categoryId', null);
				}
				// delete all lookups for this category locally
				const lookups = await client.foods.findAll({
					index: {
						where: 'categoryId',
						equals: categoryId,
					},
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
					index: {
						where: 'listId',
						equals: listId,
					},
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

	/** Recipes */
	useAddRecipeFromUrl: (client) =>
		useCallback(
			async (url: string) => {
				const scanned = await getScannedRecipe(url, client);
				const recipe = await client.recipes.put(scanned);
				return recipe;
			},
			[client],
		),

	useUpdateRecipeFromUrl: (client) =>
		useCallback(
			async (recipe: Recipe, url: string) => {
				const { instructions, ...scanned } = await getScannedRecipe(
					url,
					client,
				);
				recipe.update(scanned);

				// set this separately - do not merge
				if (instructions) {
					recipe.set('instructions', instructions);
				}
			},
			[client],
		),

	useAddRecipeIngredients: (client) =>
		useCallback(
			async (ingredients: RecipeIngredients, text: string) => {
				const lines = text.split('\n');
				const parsed = await Promise.all(
					lines
						.filter((line) => line.trim().length > 0)
						.map(async (line): Promise<RecipeIngredientsItemInit> => {
							const parsedItem = parseIngredient(line);
							let food = parsedItem.food;
							if (food) {
								// attempt to find a matching food
								try {
									const lookup = await client.foods.findOne({
										index: {
											where: 'nameLookup',
											equals: parsedItem.food,
										},
									}).resolved;
									if (lookup) {
										food = lookup.get('canonicalName');
									}
								} catch (err) {
									// ignore
								}
							}
							return {
								text: line,
								food,
								comments: parsedItem.comments,
								quantity: parsedItem.quantity,
								unit: parsedItem.unit,
								isSectionHeader: parsedItem.isSectionHeader,
							};
						}),
				);
				for (const item of parsed) {
					ingredients.push(item);
				}
			},
			[client],
		),
	useAddPantryItem: (client) =>
		useCallback(
			async (foodName: string) => {
				foodName = depluralize(foodName).toLowerCase();
				const firstWord = foodName.split(' ')[0];
				const possibleMatches = await client.foods.findAll({
					index: {
						where: 'nameLookup',
						equals: firstWord,
					},
				}).resolved;
				const food = pickBestNameMatch(possibleMatches, foodName, true);
				if (food) {
					const now = Date.now();
					food.set('lastPurchasedAt', now);
					food.set('inInventory', true);
					const expiry = food.get('expiresAfterDays');
					if (expiry) {
						food.set('expiresAt', now + expiry * 24 * 60 * 60 * 1000);
					}
				} else {
					await client.foods.put({
						canonicalName: foodName,
						lastPurchasedAt: Date.now(),
						purchaseCount: 1,
						inInventory: true,
					});
				}
			},
			[client],
		),

	useClearPantryItem: (client) =>
		useCallback(
			async (food: Food) => {
				food.set('inInventory', false);
				food.set('expiresAt', null);
			},
			[client],
		),
});

const DEBUG = localStorage.getItem('DEBUG') === 'true';
export function createClientDescriptor(options: { namespace: string }) {
	return new ClientDescriptor<Presence, Profile>({
		sync: {
			authEndpoint: `${API_HOST_HTTP}/api/lofi/groceries`,
			initialPresence: {
				lastInteractedItem: null,
				viewingRecipeId: null,
				lastInteractedCategory: null,
			},
			defaultProfile: {
				id: '',
				name: '',
			},
			useBroadcastChannel: true,
		},
		migrations,
		namespace: options.namespace,
		log:
			import.meta.env.DEV || DEBUG
				? (...args: any[]) => console.debug('🎧', ...args)
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
		purchased,
	}: {
		listId?: string | null;
		sourceInfo?: Omit<ItemInputsItemInit, 'text' | 'quantity'>;
		purchased?: boolean;
	},
) {
	if (!lines.length) return;

	const purchasedAt = purchased ? Date.now() : undefined;

	const results = await Promise.allSettled(
		lines.map(async (line) => {
			if (typeof line === 'string' && !line.trim()) return;
			const parsed = typeof line === 'string' ? parseIngredient(line) : line;
			const firstMatch = await client.items.findOne({
				index: {
					where: 'purchased_food_listId',
					match: {
						purchased: 'no',
						food: parsed.food,
						listId: listId || 'null',
					},
					order: 'asc',
				},
			}).resolved;
			if (firstMatch && !purchased) {
				const totalQuantity = firstMatch.get('totalQuantity') + parsed.quantity;
				firstMatch.set('totalQuantity', totalQuantity);
				// add the source, too
				const inputs = firstMatch.get('inputs');
				inputs.push({
					...sourceInfo,
					text: parsed.original,
				});
			} else {
				const lookup = await client.foods.findOne({
					index: {
						where: 'anyName',
						equals: parsed.food,
					},
				}).resolved;
				let categoryId: string | null = lookup?.get('categoryId') ?? null;

				if (lookup) {
					client.batch({ undoable: false }).run(() => {
						lookup.set('lastAddedAt', Date.now());
					});
				}

				// verify the category exists locally
				const category = categoryId
					? await client.categories.get(categoryId).resolved
					: null;
				if (!category) {
					categoryId = null;
				}

				let item: Item;

				const baseItemData = {
					listId: listId || lookup?.get('defaultListId') || null,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					unit: parsed.unit || '',
					food: parsed.food,
					purchasedAt,
					inputs: [
						{
							...sourceInfo,
							text: parsed.original,
							quantity: parsed.quantity,
						},
					],
				};

				if (!categoryId && navigator.onLine) {
					// race between a timeout and fetching food metadata... don't block adding the item too long if offline,
					// but attempt to prevent a pop-in of remote data changes

					const createItemPromise = new Promise((resolve) =>
						setTimeout(resolve, 200),
					).then(() => {
						return client.items.put({
							categoryId,
							...baseItemData,
						});
					});

					// in parallel, attempt to get the food data

					async function lookupFoodFromApi() {
						let remoteLookup: Awaited<
							ReturnType<typeof trpcClient.food.data.query>
						> = null;
						try {
							remoteLookup = await trpcClient.food.data.query(parsed.food);
						} catch (err) {
							console.error('Failed to lookup food', err);
						}
						if (remoteLookup) {
							await client.foods.put({
								canonicalName: remoteLookup.canonicalName,
								categoryId: remoteLookup.categoryId,
								alternateNames: remoteLookup.alternateNames,
								lastAddedAt: Date.now(),
								defaultListId: baseItemData.listId,
							});
							// verify the category exists locally
							const category = remoteLookup.categoryId
								? await client.categories.get(remoteLookup.categoryId).resolved
								: null;

							if (category) {
								// now find the item we created and update it. this is not undoable since it was not
								// user-initiated.
								if (item) {
									client.batch({ undoable: false }).run(() => {
										item.set('categoryId', remoteLookup?.categoryId);
									});
								}
								categoryId = remoteLookup.categoryId;
							}
						} else if (!lookup) {
							await client.foods.put({
								canonicalName: parsed.food,
								categoryId: null,
								alternateNames: [],
								lastAddedAt: Date.now(),
								purchaseCount: 1,
								defaultListId: baseItemData.listId,
							});
						}
					}

					// if this promise chain resolves before the other one, the categoryId variable will be
					// set and the item will be created with the correct category.
					// if it doesn't resolve first, the "if (item)" branch above will be taken and
					// the existing item will be updated.
					lookupFoodFromApi();
					item = await createItemPromise;
				} else {
					item = await client.items.put({
						categoryId,
						...baseItemData,
					});
				}
			}
		}),
	);

	const lastItemId =
		results
			.reverse()
			.find((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
			?.value?.get('id') ?? null;

	if (sourceInfo?.recipeId) {
		// record usage for this recipe
		const recipe = await client.recipes.get(sourceInfo.recipeId).resolved;
		if (recipe) {
			client.batch({ undoable: false }).run(() => {
				const previousAddedAt = recipe.get('lastAddedAt');
				if (previousAddedAt) {
					const interval = Date.now() - previousAddedAt;
					const currentGuess = recipe.get('addIntervalGuess');

					// reject outliers... if we've established a baseline
					if (
						!currentGuess ||
						(interval <= currentGuess * 2 && interval >= currentGuess / 2)
					) {
						const newGuess = Math.max(
							((currentGuess ?? 0) + interval) / 2,
							1000 * 60 * 60 * 24 * 7, // 1 week
						);
						recipe.set('addIntervalGuess', newGuess);
					}
				}

				recipe.set('lastAddedAt', Date.now());
			});
		}
	}

	if (lastItemId) {
		client.sync.presence.update({
			lastInteractedItem: lastItemId,
		});
	}
}

async function getScannedRecipe(
	url: string,
	client: Client,
): Promise<RecipeInit> {
	try {
		const scanResult = await trpcClient.scans.recipe.query({
			url,
		});
		let result: RecipeInit = {
			url,
			title: 'Web Recipe',
		};
		if (scanResult.type === 'web') {
			const scanned = scanResult.data;
			if (!scanned) {
				toast.error('Sorry, we had trouble finding a recipe on that webpage.');
			} else {
				/*if (scanned.detailedIngredients?.length) {
					result.ingredients = scanned.detailedIngredients.map(
						(i) => {
							const unitMatch = i.unit ? lookupUnit(i.unit) : null;
							return {
								food: i.foodName,
								quantity: i.quantity,
								unit:
									unitMatch?.singular?.toLowerCase() ||
									i.unit?.toLowerCase() ||
									'',
								comments: i.comments || [],
								text: i.original,
							};
						},
					);
				} else */ if (scanned.rawIngredients?.length) {
					result.ingredients = scanned.rawIngredients.map((line: string) => {
						const parsed = parseIngredient(line);
						return {
							text: parsed.sanitized,
							food: parsed.food,
							unit: parsed.unit,
							comments: parsed.comments,
							quantity: parsed.quantity,
						};
					});
				}

				// lookup foods for all ingredients
				result.ingredients = await Promise.all(
					(result.ingredients ?? []).map(async (ingredient) => {
						try {
							if (!ingredient.food) return ingredient;

							const lookup = await client.foods.findOne({
								index: {
									where: 'nameLookup',
									equals: ingredient.food,
								},
							}).resolved;
							if (lookup) {
								ingredient.food = lookup.get('canonicalName');
							}
							return ingredient;
						} catch (err) {
							// we tried...
							return ingredient;
						}
					}),
				);

				result.url = scanned.url;
				result.title = scanned.title || 'Web Recipe';
				result.prepTimeMinutes = scanned.prepTimeMinutes ?? undefined;
				result.cookTimeMinutes = scanned.cookTimeMinutes ?? undefined;
				result.totalTimeMinutes = scanned.totalTimeMinutes ?? undefined;
				result.instructions = scanned.detailedSteps
					? detailedInstructionsToDoc(scanned.detailedSteps)
					: instructionsToDoc(scanned.steps || []);
				result.servings = scanned.servings ?? undefined;
			}
		} else if (scanResult.type === 'hub') {
			const scanned = scanResult.data;
			result.ingredients = scanned.ingredients.map((i) => ({
				food: i.food,
				text: i.text,
				unit: i.unit,
				quantity: i.quantity,
				comments: (() => {
					try {
						return JSON.parse(i.comments || '[]');
					} catch (err) {
						return [];
					}
				})(),
				id: i.id,
				note: i.note,
			}));
			result.url = scanResult.url;
			result.title = scanned.title || 'Web Recipe';
			result.instructions = scanned.instructionsSerialized
				? JSON.parse(scanned.instructionsSerialized)
				: undefined;
			result.prelude = scanned.preludeSerialized
				? JSON.parse(scanned.preludeSerialized)
				: undefined;
			result.prepTimeMinutes = scanned.prepTimeMinutes ?? undefined;
			result.cookTimeMinutes = scanned.cookTimeMinutes ?? undefined;
			result.totalTimeMinutes = scanned.totalTimeMinutes ?? undefined;
			result.servings = scanned.servings ?? undefined;
		} else {
			throw new Error('Unrecognized scan result type');
		}

		return result;
	} catch (err) {
		console.error(err);
		if (err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED') {
			signupDialogState.status = 'open';
		} else if (
			err instanceof TRPCClientError &&
			err.data.code === 'FORBIDDEN'
		) {
			toast.error(err.message);
		} else {
			toast.error('Something went wrong.');
		}
		throw err;
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

// startup tasks
_groceries.then(async (g) => {
	// delete any purchased items older than 1 year
	const purchased = await g.items.findAll({
		index: {
			where: 'purchased',
			equals: 'yes',
		},
	}).resolved;
	const now = Date.now();
	const itemsToDelete = purchased
		.filter((item) => {
			const purchasedAt = item.get('purchasedAt');
			return purchasedAt && purchasedAt < now - 365 * 24 * 60 * 60 * 1000;
		})
		.map((i) => i.get('id'));
	await g.items.deleteAll(itemsToDelete);
});
