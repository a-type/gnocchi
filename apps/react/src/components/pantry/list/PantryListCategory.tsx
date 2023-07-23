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

export interface PantryListCategoryProps {
	category: Category | null;
}

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
		key: `pantry-category-${category?.get('id') ?? 'null'}}`,
	});

	return (
		<CategoryRoot
			className="pantryListCategory"
			data-is-empty={items.length === 0 && !pagination.hasMore}
			data-do-not-animate
			{...rest}
		>
			<CategoryTitleRow>
				<CategoryTitle>
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
			</CategoryTitleRow>
			<CategoryItems>
				{items.map((item) => {
					return <PantryListItem key={item.get('canonicalName')} item={item} />;
				})}
			</CategoryItems>
			{pagination.hasMore && (
				<div className="flex justify-center">
					<Button onClick={pagination.loadMore}>Show more</Button>
				</div>
			)}
		</CategoryRoot>
	);
}
