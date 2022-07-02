import { forwardRef } from 'react';
import { useSnapshot } from 'valtio';
import { groceriesStore } from '../../lib/stores/groceries';
import { GroceryListItem } from './GroceryListItem';

export interface GroceryListProps {
	className?: string;
}

export const GroceryList = forwardRef<HTMLDivElement, GroceryListProps>(
	function GroceryList({ ...rest }, ref) {
		const state = useSnapshot(groceriesStore);
		return (
			<div ref={ref} {...rest}>
				{state.items.map((item, index) => (
					<GroceryListItem key={item.id} item={groceriesStore.items[index]} />
				))}
			</div>
		);
	},
);

export default GroceryList;
