import { Button } from '../primitives';
import React, { forwardRef } from 'react';
import { hooks, groceries } from 'stores/groceries';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	// TODO: if multiple lists are ever supported, this
	// will need to query based on list.
	const { data: items } = hooks.useAllItems({
		where: 'purchased',
		equals: 'yes',
	});

	const deleteCompleted = async () => {
		if (items?.length) {
			await groceries.deleteItems(items.map((i) => i.id));
		}
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
