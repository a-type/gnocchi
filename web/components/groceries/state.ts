import { GroceryItemData } from 'lib/stores/groceries';
import { proxy, ref } from 'valtio';

export const groceriesState = proxy({
	newCategoryPendingItem: null as GroceryItemData | null,
});
