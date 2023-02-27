import { hooks } from '@/stores/groceries/index.js';
import { Category, Item } from '@aglio/groceries-client';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import { useMemo } from 'react';

export function useItemsGroupedAndSorted() {
	const items =
		hooks.useAllItems({
			index: {
				where: 'purchased',
				equals: 'yes',
			},
		}) || [];
	const categories = hooks.useAllCategories() || [];
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
		return { groupedItems: categoryGroups, empty: items.length === 0 };
	}, [items, categories]);
}

// keeping this static to make the query reusable
const THREE_DAYS_FROM_NOW = addDays(endOfDay(new Date()), 3).getTime();
export function useExpiresSoonItems() {
	return hooks.useAllItems({
		index: {
			where: 'purchasedAndExpiresAt',
			lt: THREE_DAYS_FROM_NOW,
		},
	});
}
