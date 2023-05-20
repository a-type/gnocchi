import { PantryActionBar } from '@/components/pantry/actions/PantryActionBar.jsx';
import { PantryList } from '@/components/pantry/list/PantryList.jsx';
import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@aglio/ui/components/layouts';
import { Suspense } from 'react';

export interface PantryPageProps {}

export function PantryPage({}: PantryPageProps) {
	return (
		<PageRoot>
			<PageContent fullHeight innerProps={{ className: 'gap-3' }}>
				<PageFixedArea>
					<PantryActionBar />
				</PageFixedArea>
				<Suspense>
					<PantryList />
				</Suspense>
			</PageContent>
		</PageRoot>
	);
}

export default PantryPage;
