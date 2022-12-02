import { Category, hooks, Item } from '@/stores/groceries/index.js';
import { useMemo } from 'react';

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
