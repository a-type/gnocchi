import { LongPressAction } from '@/components/groceries/actions/LongPressAction.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { CheckboxIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';

export function PurchaseAllAction() {
	const purchaseItems = hooks.usePurchaseItems();
	const listId = useListId();
	const items = hooks
		.useAllItems({
			index: {
				where: 'purchased',
				equals: 'no',
			},
			// TODO: optimize this with a combined index?
		})
		.filter((item) => listId === undefined || item.get('listId') === listId);

	const onActivate = useCallback(() => {
		purchaseItems(items);
	}, [purchaseItems, items]);

	return (
		<LongPressAction
			visible={items.length > 0}
			size="small"
			onActivate={onActivate}
			icon={<CheckboxIcon />}
			progressColor="primaryLight"
		>
			Purchase All
		</LongPressAction>
	);
}
