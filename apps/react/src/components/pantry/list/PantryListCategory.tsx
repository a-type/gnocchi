import { Category, Item } from '@aglio/groceries-client';
import { PantryListItem } from '../items/PantryListItem.jsx';
import {
	CategoryTitle,
	CategoryTitleRow,
} from '@/components/groceries/categories/CategoryTitleRow.jsx';
import {
	CategoryItems,
	CategoryRoot,
} from '@/components/groceries/categories/GroceryListCategory.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@aglio/ui/components/button';
import { CardGrid } from '@aglio/ui/components/card';
import { useFilter } from '@/components/pantry/hooks.js';
import { useMemo } from 'react';

export interface PantryListCategoryProps {
	category: Category | null;
}

const pageSize = 10;

export function PantryListCategory({
	category,
	...rest
}: PantryListCategoryProps) {
	const [items, pagination] = hooks.useAllFoodsInfinite({
		index: {
			where: 'categoryId_lastPurchasedAt',
			match: {
				categoryId: category?.get('id') ?? 'null',
			},
			order: 'desc',
		},
		key: `pantry-category-${category?.get('id') ?? 'null'}`,
		pageSize,
	});
	const [filter] = useFilter();
	const filteredItems = useMemo(() => {
		if (filter === 'all') {
			return items;
		}
		return items.filter((i) => !!i.get('lastPurchasedAt'));
	}, [items, filter]);

	const showShowMore = pagination.hasMore && filteredItems.length === pageSize;

	return (
		<CategoryRoot
			className="pantryListCategory"
			data-is-empty={filteredItems.length === 0 && !showShowMore}
			data-do-not-animate
			{...rest}
		>
			<CategoryTitleRow>
				<CategoryTitle>
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
			</CategoryTitleRow>
			<CategoryItems>
				<CardGrid className="grid-cols-[repeat(2,1fr)]">
					{filteredItems.map((item) => {
						return (
							<PantryListItem key={item.get('canonicalName')} item={item} />
						);
					})}
				</CardGrid>
			</CategoryItems>
			{showShowMore && (
				<div className="flex justify-center mt-4">
					<Button color="ghost" onClick={pagination.loadMore}>
						Show more
					</Button>
				</div>
			)}
		</CategoryRoot>
	);
}
