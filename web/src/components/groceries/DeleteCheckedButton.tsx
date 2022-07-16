import { Button } from '../primitives';
import React, { forwardRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { groceries } from 'stores/groceries/db';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	const items = useLiveQuery(() => {
		return groceries.items
			.filter((item) => item.purchasedQuantity >= item.totalQuantity)
			.toArray();
	});

	const deleteCompleted = async () => {
		if (!items) return;
		await groceries.items.bulkDelete(items.map((item) => item.id));
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
