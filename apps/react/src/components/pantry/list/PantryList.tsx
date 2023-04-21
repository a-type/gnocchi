import classNames from 'classnames';
import { useItemsGroupedAndSorted } from '../hooks.js';
import * as classes from './PantryList.css.js';
import { PantryListCategory } from './PantryListCategory.jsx';
import { ExpiresSoonSection } from './ExpiresSoonSection.jsx';
import { Suspense } from 'react';
import { PantryListItemSkeleton } from '@/components/pantry/items/PantryListItem.jsx';

export interface PantryListProps {
	className?: string;
}

function PantryListInner({ className, ...rest }: PantryListProps) {
	const { groupedItems, empty } = useItemsGroupedAndSorted();

	return (
		<div className={classNames(classes.root)} {...rest}>
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

export function PantryList(props: PantryListProps) {
	return (
		<Suspense fallback={<SkeletonList />}>
			<PantryListInner {...props} />
		</Suspense>
	);
}

function SkeletonList() {
	return (
		<div className={classes.root}>
			<div style={{ height: 30 }} />
			{new Array(8).fill(null).map((_, i) => (
				<PantryListItemSkeleton key={i} />
			))}
		</div>
	);
}
