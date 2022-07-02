import { GroceryListAdd } from 'components/groceries/GroceryListAdd';
import dynamic from 'next/dynamic';

const DynamicGroceryList = dynamic(
	() => import('components/groceries/GroceryList'),
	{
		ssr: false,
	},
);

export default function GroceriesPage() {
	return (
		<div>
			<h1>Groceries</h1>
			<DynamicGroceryList />
			<GroceryListAdd />
		</div>
	);
}
