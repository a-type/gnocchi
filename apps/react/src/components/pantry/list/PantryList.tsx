import { useItemsGroupedAndSorted } from '../hooks.js';
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
		<div className="flex flex-col items-stretch w-full" {...rest}>
			<ExpiresSoonSection />
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
			{empty && (
				<div className="flex flex-col items-center justify-center text-center w-full p-8 opacity-70">
					Nothing here yet...
				</div>
			)}
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
		<div className="flex flex-col items-stretch">
			<div style={{ height: 30 }} />
			{new Array(8).fill(null).map((_, i) => (
				<PantryListItemSkeleton key={i} />
			))}
		</div>
	);
}
