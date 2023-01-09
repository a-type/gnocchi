import { clsx } from 'clsx';
import * as groceryCategoryClasses from '@/components/groceries/categories/GroceryListCategory.css.js';
import { Category, Item } from '@aglio/groceries-client';
import { PantryListItem } from '../items/PantryListItem.jsx';

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
		<div
			className={clsx('pantryListCategory', groceryCategoryClasses.root)}
			data-is-empty={!items || items?.length === 0}
			data-do-not-animate
			{...rest}
		>
			<div className={groceryCategoryClasses.titleRow}>
				<h2 className={groceryCategoryClasses.title}>
					{category?.get('name') ?? 'Uncategorized'}
				</h2>
			</div>
			<div className={groceryCategoryClasses.items}>
				{items?.map((item, index) => {
					return <PantryListItem key={item.get('id')} item={item} />;
				})}
			</div>
		</div>
	);
}
