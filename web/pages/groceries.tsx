import { GroceryListAdd } from 'components/groceries/GroceryListAdd';
import { PageContent, PageNowPlayingBar, PageRoot } from 'components/layouts';
import dynamic from 'next/dynamic';

const DynamicGroceryList = dynamic(
	() => import('components/groceries/GroceryList'),
	{
		ssr: false,
		loading: () => <div style={{ flex: 1 }} />,
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
				<GroceryListAdd />
			</PageNowPlayingBar>
		</PageRoot>
	);
}

export const getStaticProps = async () => {
	return {
		props: {},
	};
};
