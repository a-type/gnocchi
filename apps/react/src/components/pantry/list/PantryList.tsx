import { clsx } from 'clsx';
import { useItemsGroupedAndSorted } from '../hooks.js';
import * as classes from './PantryList.css.js';
import { PantryListCategory } from './PantryListCategory.jsx';
import { ExpiresSoonSection } from './ExpiresSoonSection.jsx';
import { Suspense } from 'react';

export interface PantryListProps {
	className?: string;
}

export function PantryList({ className, ...rest }: PantryListProps) {
	const { groupedItems, empty } = useItemsGroupedAndSorted();

	return (
		<div className={clsx(classes.root)}>
			<Suspense>
				<ExpiresSoonSection />
			</Suspense>
			<div>
				{groupedItems.map(({ category, items }) => {
					return (
						<PantryListCategory
							key={category?.get('id') ?? 'null'}
							category={category}
							items={items}
						/>
					);
				})}
			</div>
			{empty && <div className={classes.empty}>Nothing here yet...</div>}
		</div>
	);
}
