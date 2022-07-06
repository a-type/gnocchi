import { GroceryListAdd } from 'components/groceries/GroceryListAdd';
import { PageContent, PageNowPlayingBar, PageRoot } from 'components/layouts';
import { Box } from 'components/primitives';
import dynamic from 'next/dynamic';

const DynamicGroceryList = dynamic(
	() => import('components/groceries/GroceryList'),
	{
		ssr: false,
		loading: () => <div style={{ flex: 1 }} />,
	},
);
const DynamicDeleteCheckedButton = dynamic(
	() => import('components/groceries/DeleteCheckedButton'),
	{
		ssr: false,
	},
);

export default function GroceriesPage() {
	return (
		<PageRoot>
			<PageContent fullHeight flex={1}>
				<h1>Groceries</h1>
				<DynamicGroceryList />
			</PageContent>
			<PageNowPlayingBar>
				<Box w="full" p={1} direction="column" gap={2} align="stretch">
					<DynamicDeleteCheckedButton />
					<GroceryListAdd />
				</Box>
			</PageNowPlayingBar>
		</PageRoot>
	);
}

export const getStaticProps = async () => {
	return {
		props: {},
	};
};
