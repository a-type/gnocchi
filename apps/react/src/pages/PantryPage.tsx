import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@/components/layouts/index.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { PantryActionBar } from '@/components/pantry/actions/PantryActionBar.jsx';
import { PantryList } from '@/components/pantry/list/PantryList.jsx';
import { H1 } from '@aglio/ui';
import { sprinkles } from '@aglio/ui';
import { Suspense } from 'react';

export interface PantryPageProps {}

export function PantryPage({}: PantryPageProps) {
	return (
		<PageRoot>
			<PageContent fullHeight noPadding nav>
				<H1 className={sprinkles({ p: 4, marginBottom: 0, paddingBottom: 0 })}>
					Purchased
				</H1>
				<PageFixedArea className={sprinkles({ p: 2 })}>
					<PantryActionBar />
				</PageFixedArea>
				<Suspense>
					<PantryList />
				</Suspense>
			</PageContent>
		</PageRoot>
	);
}
