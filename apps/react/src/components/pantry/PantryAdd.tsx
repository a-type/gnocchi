import { AddBar } from '@/components/addBar/AddBar.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { useCallback } from 'react';

export interface PantryAddProps {}

export function PantryAdd({}: PantryAddProps) {
	const addItems = hooks.useAddItems();
	const onAdd = useCallback(
		(items: string[]) => {
			return addItems(items, {
				purchased: true,
			});
		},
		[addItems],
	);

	return <AddBar onAdd={onAdd} />;
}
