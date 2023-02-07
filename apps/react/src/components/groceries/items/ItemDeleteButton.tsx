import React from 'react';
import { Button, ButtonProps } from '@aglio/ui';
import { groceries } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';

export interface ItemDeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
	item: Item;
}

export function ItemDeleteButton({ item, ...rest }: ItemDeleteButtonProps) {
	const deleteItem = () => {
		groceries.deleteItem(item);
	};

	return <Button onClick={deleteItem} {...rest} />;
}
