import { useItemsGroupedAndSorted } from '../hooks.js';
import { PantryListCategory } from './PantryListCategory.jsx';
import { ExpiresSoonSection } from './ExpiresSoonSection.jsx';
import { Suspense } from 'react';
import { PantryListItemSkeleton } from '@/components/pantry/items/PantryListItem.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { CardGrid } from '@aglio/ui/components/card';

export interface PantryListProps {
	className?: string;
}

function PantryListInner({ className, ...rest }: PantryListProps) {
	const categories = hooks.useAllCategories();

	return (
		<div className="flex flex-col items-stretch w-full" {...rest}>
			<ExpiresSoonSection />
			<div>
				{categories.map((category) => {
					return (
						<Suspense key={category.get('id')}>
							<PantryListCategory category={category} />
						</Suspense>
					);
				})}
				<Suspense>
					<PantryListCategory category={null} />
				</Suspense>
			</div>
			<AutoRestoreScroll id="pantryList" />
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
			<CardGrid>
				{new Array(8).fill(null).map((_, i) => (
					<PantryListItemSkeleton key={i} />
				))}
			</CardGrid>
		</div>
	);
}
