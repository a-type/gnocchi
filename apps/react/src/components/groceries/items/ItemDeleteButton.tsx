import { Button, ButtonProps } from '@aglio/ui/components/button';
import { Item } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';

export interface ItemDeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
	item: Item;
}

export function ItemDeleteButton({ item, ...rest }: ItemDeleteButtonProps) {
	const deleteItem = hooks.useDeleteItem();
	const onDelete = () => {
		deleteItem(item);
	};

	return <Button onClick={onDelete} {...rest} />;
}
