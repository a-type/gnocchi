import React from 'react';
import { Button, ButtonProps } from '@/components/primitives/primitives.js';
import { groceries, GroceryItem } from '@/stores/groceries/index.js';

export interface ItemDeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
	item: GroceryItem;
}

export function ItemDeleteButton({ item, ...rest }: ItemDeleteButtonProps) {
	const deleteItem = () => {
		groceries.deleteItem(item);
	};

	return <Button onClick={deleteItem} {...rest} />;
}
