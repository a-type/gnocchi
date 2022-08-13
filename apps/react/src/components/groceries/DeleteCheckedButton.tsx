import { Button } from '../primitives';
import React, { forwardRef } from 'react';
import { commit } from '@aphro/runtime-ts';
import { useQuery } from 'stores/groceries';
import { GroceryItem } from '@aglio/data';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	// TODO: if multiple lists are ever supported, this
	// will need to query based on list.
	const items = useQuery(
		(ctx) =>
			GroceryItem.queryAll(ctx).where(
				(item) => item.purchasedQuantity >= item.totalQuantity,
			),
		{
			key: 'purchased-items',
		},
	);
	const checkedItems = items.filter(
		(item) => item.purchasedQuantity >= item.totalQuantity,
	);

	const deleteCompleted = () => {
		if (items.length) {
			commit(
				items[0].ctx,
				checkedItems.map((item) => item.delete()),
			);
		}
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
