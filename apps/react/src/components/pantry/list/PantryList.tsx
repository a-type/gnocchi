import { clsx } from 'clsx';
import { useItemsGroupedAndSorted } from '../hooks.js';
import * as classes from './PantryList.css.js';
import { PantryListCategory } from './PantryListCategory.jsx';

export interface PantryListProps {
	className?: string;
}

export function PantryList({ className, ...rest }: PantryListProps) {
	const { groupedItems, empty } = useItemsGroupedAndSorted();

	return (
		<div className={clsx(classes.root)}>
			{groupedItems.map(({ category, items }) => {
				return (
					<PantryListCategory
						key={category?.get('id') ?? 'null'}
						category={category}
						items={items}
					/>
				);
			})}
			{empty && <div className={classes.empty}>Nothing here yet...</div>}
		</div>
	);
}
