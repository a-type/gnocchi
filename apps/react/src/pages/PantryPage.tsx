import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@/components/layouts/index.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { PantryActionBar } from '@/components/pantry/actions/PantryActionBar.jsx';
import { PantryList } from '@/components/pantry/list/PantryList.jsx';
import { H1 } from '@/components/primitives/index.js';
import { groceriesDescriptor, hooks } from '@/stores/groceries/index.js';
import { Suspense } from 'react';

export interface PantryPageProps {}

export function PantryPage({}: PantryPageProps) {
	return (
		<hooks.Provider value={groceriesDescriptor}>
			<PageRoot>
				<PageContent fullHeight noPadding>
					<H1 css={{ p: '$4', mb: 0, pb: 0 }}>Purchased</H1>
					<PageFixedArea>
						<PantryActionBar />
					</PageFixedArea>
					<Suspense>
						<PantryList />
					</Suspense>
				</PageContent>
			</PageRoot>
		</hooks.Provider>
	);
}
