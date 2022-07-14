import { Button } from '../primitives';
import React, { forwardRef } from 'react';
import { useGroceryList } from 'contexts/GroceryListContext';
import { useQuery } from '@aphro/react';
import { commit } from '@aphro/runtime-ts';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	const list = useGroceryList();
	const { data: items } = useQuery(
		() =>
			list
				.queryItems()
				.where((item) => item.purchasedQuantity >= item.totalQuantity),
		[],
	);
	const checkedItems = items.filter(
		(item) => item.purchasedQuantity >= item.totalQuantity,
	);

	const deleteCompleted = () => {
		commit(
			list.ctx,
			checkedItems.map((item) => item.delete()),
		);
	};

	const areAnyChecked = checkedItems.length > 0;

	if (!areAnyChecked) return null;

	return (
		<Button
			color="default"
			size="small"
			ref={ref}
			onClick={deleteCompleted}
			{...rest}
		>
			Delete Purchased
		</Button>
	);
});

export default DeleteCheckedButton;
