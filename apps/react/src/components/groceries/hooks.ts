import { hooks } from '@/stores/groceries/index.js';
import { Category, Item } from '@aglio/groceries-client';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { groceriesState } from './state.js';

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
	return useMemo(() => {
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
		for (const item of items) {
			const categoryId = item.get('categoryId');
			const categoryIndex =
				categoryIndexLookup.get(categoryId) ?? categoryIndexLookup.get(null)!;
			categoryGroups[categoryIndex].items.push(item);
		}
		return categoryGroups;
	}, [items, categories]);
}

export function useTransitionPurchasedItems() {
	const { purchasedStillVisibleItems, purchasedHidingItems } =
		useSnapshot(groceriesState);
	useEffect(() => {
		if (purchasedStillVisibleItems.size) {
			const timeout1 = setTimeout(() => {
				console.log('moving items to hiding');
				for (const id of purchasedStillVisibleItems) {
					groceriesState.purchasedHidingItems.add(id);
				}
				groceriesState.purchasedStillVisibleItems.clear();
			}, 5000);
			return () => {
				clearTimeout(timeout1);
			};
		}
	}, [purchasedStillVisibleItems.size]);
	useEffect(() => {
		if (purchasedHidingItems.size) {
			const timeout = setTimeout(() => {
				console.log('clearing hiding');
				groceriesState.purchasedHidingItems.clear();
			}, 1000);
			return () => clearTimeout(timeout);
		}
	}, [purchasedHidingItems.size]);
}
