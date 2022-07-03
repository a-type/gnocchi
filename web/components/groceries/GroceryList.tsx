import { forwardRef } from 'react';
import { useSnapshot } from 'valtio';
import { groceriesStore, GroceryItemData } from 'lib/stores/groceries';
import { GroceryListItem } from './GroceryListItem';
import { Box, H2 } from 'components/primitives';

export interface GroceryListProps {
	className?: string;
}

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const state = useSnapshot(groceriesStore);

		return (
			<Box id="groceryList" w="full" flex={1} p={2} gap={3} ref={ref} {...rest}>
				{Object.keys(state.categories).map((category) => {
					console.log(category, groceriesStore.categories[category]);
					return <GroceryListCategory key={category} categoryName={category} />;
				})}
			</Box>
		);
	},
);

export default GroceryList;

function GroceryListCategory({
	categoryName,
	...rest
}: {
	categoryName: string;
}) {
	const category = groceriesStore.categories[categoryName];
	const state = useSnapshot(category);
	console.log('rendering', categoryName, category);
	return (
		<Box className="groceryCategory" p={2} gap={3} {...rest}>
			<H2 css={{ textTransform: 'capitalize' }}>{categoryName}</H2>
			{state.map((item, index) => (
				<GroceryListItem key={item.id} item={category[index]} />
			))}
		</Box>
	);
}
