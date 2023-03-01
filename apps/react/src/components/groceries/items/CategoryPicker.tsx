import { groceries, hooks } from '@/stores/groceries/index.js';
import { Item } from '@aglio/groceries-client';
import { useCallback } from 'react';
import { CategorySelect } from '../categories/CategorySelect.jsx';
import { groceriesState } from '../state.js';
import { RowSpacingIcon } from '@radix-ui/react-icons';

export function CategoryPicker({ item }: { item: Item }) {
	const { categoryId } = hooks.useWatch(item);

	const setCategory = useCallback(
		(value: string | null) => {
			if (value === null) {
				groceries.setItemCategory(item, null, false);
			} else {
				groceries.setItemCategory(item, value, true);
			}
			groceriesState.justMovedItemId = item.get('id');
		},
		[item],
	);

	return (
		<CategorySelect value={categoryId} onChange={setCategory}>
			<RowSpacingIcon />
		</CategorySelect>
	);
}
