import { Category } from '@aglio/groceries-client';
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
import { Button } from '@a-type/ui/components/button';
import { CardGrid } from '@a-type/ui/components/card';
import { useFilter } from '@/components/pantry/hooks.js';
import { useEffect } from 'react';
import { pantryOnboarding } from '@/onboarding/pantryOnboarding.js';

export interface PantryListCategoryProps {
	category: Category | null;
}

const pageSize = 10;

export function PantryListCategory({
	category,
	...rest
}: PantryListCategoryProps) {
	const [filter] = useFilter();
	const [items, pagination] = hooks.useAllFoodsInfinite({
		index:
			filter === 'all'
				? {
						where: 'categoryId_lastPurchasedAt',
						match: {
							categoryId: category?.get('id') ?? 'null',
						},
						order: 'desc',
				  }
				: filter === 'frozen'
				? {
						where: 'frozen',
						equals: true,
				  }
				: {
						where: 'inInventory_categoryId_lastPurchasedAt',
						match: {
							inInventory: true,
							categoryId: category?.get('id') ?? 'null',
						},
						order: 'desc',
				  },
		key: `pantry-category-${category?.get('id') ?? 'null'}`,
		pageSize,
	});

	// trigger onboarding once items exist
	const hasItems = !!items.length;
	useEffect(() => {
		if (hasItems) pantryOnboarding.begin();
	}, [hasItems]);

	const showShowMore = pagination.hasMore;

	return (
		<CategoryRoot
			className="pantryListCategory"
			data-is-empty={items.length === 0 && !showShowMore}
			data-do-not-animate
			{...rest}
		>
			<CategoryTitleRow className="mb-1">
				<CategoryTitle className="!text-sm">
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
			</CategoryTitleRow>
			<CategoryItems>
				<CardGrid className="grid-cols-[repeat(2,1fr)]">
					{items.map((item) => {
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
