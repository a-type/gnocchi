import { Button } from '../primitives';
import React, { forwardRef } from 'react';
import { groceries } from 'stores/groceries/db';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	const allItems = groceries.useQuery((db) => db.items.find());
	const items = allItems.filter(
		(item) => item.purchasedQuantity >= item.totalQuantity,
	);

	const deleteCompleted = async () => {
		if (!items) return;
		await groceries.deleteItems(items.map((item) => item.id));
	};

	const areAnyChecked = !!items?.length;

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
