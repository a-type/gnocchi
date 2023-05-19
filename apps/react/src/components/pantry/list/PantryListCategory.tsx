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

export interface PantryListCategoryProps {
	category: Category | null;
	items: Item[];
}

export function PantryListCategory({
	category,
	items,
	...rest
}: PantryListCategoryProps) {
	return (
		<CategoryRoot
			className="pantryListCategory"
			data-is-empty={!items || items?.length === 0}
			data-do-not-animate
			{...rest}
		>
			<CategoryTitleRow>
				<CategoryTitle>
					{category?.get('name') ?? 'Uncategorized'}
				</CategoryTitle>
			</CategoryTitleRow>
			<CategoryItems>
				{items?.map((item, index) => {
					return <PantryListItem key={item.get('id')} item={item} />;
				})}
			</CategoryItems>
		</CategoryRoot>
	);
}
