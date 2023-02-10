import { hooks } from '@/stores/groceries/index.js';
import { Category, Item } from '@aglio/groceries-client';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { groceriesState } from './state.js';
import { debounce } from '@a-type/utils';

export function useItemsGroupedAndSorted(
	listId: string | null | undefined = undefined,
) {
	const items = hooks.useAllItems(
		listId === undefined
			? undefined
			: {
					index: {
						where: 'listId',
						equals: listId,
					},
			  },
	);
	const categories = hooks.useAllCategories();
	const { purchasedStillVisibleItems, purchasedHidingItems } =
		useSnapshot(groceriesState);

	const visibleItems = useMemo(
		() =>
			items.filter((item) => {
				if (!item.get('purchasedAt')) return true;
				return (
					purchasedStillVisibleItems.has(item.get('id')) ||
					purchasedHidingItems.has(item.get('id'))
				);
			}),
		[items, purchasedStillVisibleItems, purchasedHidingItems],
	);

	const categoryGroups = useMemo(() => {
		const categoryGroups: { category: Category | null; items: Item[] }[] = [];
		const sortedCategories: (Category | null)[] = categories
			.slice()
			.sort((a, b) => {
				if (a.get('sortKey') > b.get('sortKey')) return 1;
				if (a.get('sortKey') < b.get('sortKey')) return -1;
				return 0;
			});
		sortedCategories.push(null);

		const categoryIndexLookup = new Map<string | null, number>();
		for (const category of sortedCategories) {
			const group = {
				category,
				items: [],
			};
			categoryGroups.push(group);
			categoryIndexLookup.set(
				category?.get('id') ?? null,
				categoryGroups.length - 1,
			);
		}
		for (const item of visibleItems) {
			const categoryId = item.get('categoryId');
			const categoryIndex =
				categoryIndexLookup.get(categoryId) ?? categoryIndexLookup.get(null)!;
			categoryGroups[categoryIndex].items.push(item);
		}
		return categoryGroups;
	}, [visibleItems, categories]);

	return {
		categoryGroups,
		itemCount: visibleItems.length,
	};
}

export function useTransitionPurchasedItems() {
	const { purchasedStillVisibleItems, purchasedHidingItems } =
		useSnapshot(groceriesState);
	// no cleanups in these effects since we want them to run even if
	// the user navigates away
	useEffect(() => {
		if (purchasedStillVisibleItems.size) {
			debouncedMovePurchasedItemsToHiding();
		}
	}, [purchasedStillVisibleItems.size]);
}

function movePurchasedItemsToHiding() {
	console.log('moving purchased items to hiding');
	for (const id of groceriesState.purchasedStillVisibleItems) {
		groceriesState.purchasedHidingItems.add(id);
	}
	groceriesState.purchasedStillVisibleItems.clear();
	debouncedClearPurchasedHidingItems();
}
const debouncedMovePurchasedItemsToHiding = debounce(
	movePurchasedItemsToHiding,
	5000,
);

function clearPurchasedHidingItems() {
	console.log('clearing purchased hiding items');
	groceriesState.purchasedHidingItems.clear();
}
const debouncedClearPurchasedHidingItems = debounce(
	clearPurchasedHidingItems,
	1000,
);
