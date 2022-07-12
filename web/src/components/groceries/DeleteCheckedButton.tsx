import { Button } from '../primitives';
import React, { forwardRef } from 'react';
import { useGroceryList } from 'contexts/GroceryListContext';
import { useQuery, unwraps } from '@aphro/react';
import { commit, UpdateType } from '@aphro/runtime-ts';
import GroceryItemMutations from 'stores/groceries/.generated/GroceryItemMutations';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	const list = useGroceryList();
	const [items] = unwraps(
		useQuery(
			UpdateType.ANY,
			() =>
				list
					.queryItems()
					.where((item) => item.purchasedQuantity >= item.totalQuantity),
			[],
		),
	);
	const checkedItems = items.filter(
		(item) => item.purchasedQuantity >= item.totalQuantity,
	);

	const deleteCompleted = () => {
		commit(
			list.ctx,
			checkedItems.map((item) =>
				GroceryItemMutations.delete(item, {}).toChangeset(),
			),
		);
	};

	const areAnyChecked = checkedItems.length > 0;

	if (!areAnyChecked) return null;

	return (
		<Button color="ghost" ref={ref} onClick={deleteCompleted} {...rest}>
			Delete Purchased
		</Button>
	);
});

export default DeleteCheckedButton;
