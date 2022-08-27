import GroceryItem from 'stores/groceries/index.js';
import { proxy, ref } from 'valtio';

export const groceriesState = proxy({
	newCategoryPendingItem: null as GroceryItem | null,
	justCreatedCategoryId: null as any | null,
	draggedItemOriginalCategory: null as any | null,
	draggedItemOriginalSortKey: null as any | null,
	isAnyItemDragged: false,
});