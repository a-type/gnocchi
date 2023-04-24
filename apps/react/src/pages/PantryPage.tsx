import { PantryHeader } from '@/components/pantry/PantryHeader.jsx';
import { PantryActionBar } from '@/components/pantry/actions/PantryActionBar.jsx';
import { PantryList } from '@/components/pantry/list/PantryList.jsx';
import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@aglio/ui/components/layouts';
import { Suspense } from 'react';

export interface PantryPageProps {}

const innerProps = {
	gap: 3,
} as const;

export function PantryPage({}: PantryPageProps) {
	return (
		<PageRoot>
			<PageContent fullHeight nav innerProps={innerProps}>
				<PantryHeader />
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
