import { PantryActionBar } from '@/components/pantry/actions/PantryActionBar.jsx';
import { useSearch } from '@/components/pantry/hooks.js';
import { PantrySearch } from '@/components/pantry/search/PantrySearch.jsx';
import { PageContent, PageFixedArea } from '@aglio/ui/components/layouts';
import { Outlet } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface PantryPageProps {}

export function PantryPage({}: PantryPageProps) {
	return (
		<PageContent fullHeight innerProps={{ className: 'gap-3' }}>
			<PantrySearch />
			<PageFixedArea>
				<PantryActionBar />
			</PageFixedArea>
			<Suspense>
				<Outlet />
			</Suspense>
		</PageContent>
	);
}

export default PantryPage;
