import { useListId } from '@/contexts/ListContext.jsx';
import { AddBar } from '@/components/addBar/AddBar.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { forwardRef, useCallback } from 'react';

export interface GroceryListAddProps {
	className?: string;
}

export const GroceryListAdd = forwardRef<HTMLDivElement, GroceryListAddProps>(
	function GroceryListAddImpl({ ...rest }, ref) {
		const listId = useListId() || null;
		const addItems = hooks.useAddItems();
		const onAdd = useCallback(
			(items: string[]) => {
				return addItems(items, {
					listId,
				});
			},
			[listId, addItems],
		);

		return <AddBar onAdd={onAdd} showRichSuggestions {...rest} />;
	},
);
