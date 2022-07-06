import { Button } from 'components/primitives';
import { groceriesStore } from 'lib/stores/groceries';
import { forwardRef } from 'react';
import { useSnapshot } from 'valtio';

export interface DeleteCheckedButtonProps {
	className?: string;
}

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ ...rest }, ref) {
	const items = useSnapshot(groceriesStore.items);

	const areAnyChecked = items.some(
		(item) => item.purchasedQuantity >= item.totalQuantity,
	);

	if (!areAnyChecked) return null;

	return (
		<Button
			color="ghost"
			ref={ref}
			onClick={() => {
				groceriesStore.items.forEach((item) => {
					if (item.purchasedQuantity >= item.totalQuantity) {
						groceriesStore.items.splice(groceriesStore.items.indexOf(item), 1);
					}
				});
			}}
			{...rest}
		>
			Delete Purchased
		</Button>
	);
});

export default DeleteCheckedButton;
