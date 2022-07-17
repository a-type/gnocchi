import { GroceryItem } from 'stores/groceries';
import { proxy, ref } from 'valtio';
import { RxDocument } from 'rxdb';

export const groceriesState = proxy({
	newCategoryPendingItem: null as RxDocument<GroceryItem> | null,
	justCreatedCategoryId: null as any | null,
	draggedItemOriginalCategory: null as any | null,
	draggedItemOriginalSortKey: null as any | null,
	isAnyItemDragged: false,
});
