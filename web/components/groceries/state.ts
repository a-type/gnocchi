import { GroceryItemData } from 'lib/stores/groceries';
import { createRef } from 'react';
import { proxy, ref } from 'valtio';

export const groceriesState = proxy({
	newCategoryPendingItem: null as GroceryItemData | null,
	justCreatedCategoryName: null as string | null,
});

export const newCategoryFlipData = {
	current: null as null | {
		top: number;
		left: number;
		width: number;
		height: number;
	},
};
