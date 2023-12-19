import { PantryListCategory } from './PantryListCategory.jsx';
import { ExpiresSoonSection } from './ExpiresSoonSection.jsx';
import { Suspense } from 'react';
import { PantryListItemSkeleton } from '@/components/pantry/items/PantryListItem.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { CardGrid } from '@a-type/ui/components/card';
import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner.jsx';
import { pantryOnboarding } from '@/onboarding/pantryOnboarding.js';
import { PantryListSectionTabs } from './PantryListSectionTabs.jsx';

export interface PantryListProps {
	className?: string;
}

function PantryListInner({ className, ...rest }: PantryListProps) {
	const categories = hooks.useAllCategories({
		index: {
			where: 'sortKey',
			order: 'asc',
		},
	});

	return (
		<div className="flex flex-col items-stretch w-full" {...rest}>
			<OnboardingBanner
				onboarding={pantryOnboarding}
				step="expirations"
				className="mb-3"
			>
				You can add expiration dates to foods to get notified when they're about
				to expire. Tap any food to get started.
			</OnboardingBanner>
			<ExpiresSoonSection />
			<PantryListSectionTabs />
			<div className="flex flex-col gap-4">
				{categories.map((category) => {
					return (
						<PantryListCategory key={category.get('id')} category={category} />
					);
				})}
				<PantryListCategory category={null} />
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
			<CardGrid className="grid-cols-[repeat(2,1fr)]">
				{new Array(8).fill(null).map((_, i) => (
					<PantryListItemSkeleton key={i} />
				))}
			</CardGrid>
		</div>
	);
}
