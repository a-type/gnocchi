import { GroceryListAdd } from 'components/groceries/GroceryListAdd';
import { PageContent, PageRoot } from 'components/layouts';
import dynamic from 'next/dynamic';

const DynamicGroceryList = dynamic(
	() => import('components/groceries/GroceryList'),
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
				<GroceryListAdd />
			</PageContent>
		</PageRoot>
	);
}
