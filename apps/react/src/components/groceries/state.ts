import { Item } from '@/stores/groceries/index.js';
import { proxy } from 'valtio';
import { proxySet } from 'valtio/utils';

export const groceriesState = proxy({
	newCategoryPendingItem: null as Item | null,
	justCreatedCategoryId: null as any | null,
	draggedItemOriginalCategory: null as any | null,
	isAnyItemDragged: false,
	justMovedItemId: null as string | null,
	purchasedStillVisibleItems: proxySet<string>(),
	purchasedHidingItems: proxySet<string>(),
	justAddedRecipe: false,
});
