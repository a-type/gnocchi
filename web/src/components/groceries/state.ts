import GroceryItem from 'stores/groceries/.generated/GroceryItem';
import { proxy, ref } from 'valtio';

export const groceriesState = proxy({
	newCategoryPendingItem: null as GroceryItem | null,
	justCreatedCategoryId: null as any | null,
});

export const newCategoryFlipData = {
	current: null as null | {
		top: number;
		left: number;
		width: number;
		height: number;
	},
};
