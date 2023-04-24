import { LongPressAction } from '@/components/groceries/actions/LongPressAction.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { TrashIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';

export interface DeleteAllActionProps {}

export function DeleteAllAction({}: DeleteAllActionProps) {
	const deleteItems = hooks.useDeleteItems();
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
	const deleteAll = useCallback(() => {
		console.log('hello world', items);
		deleteItems(items.map((i) => i.get('id')));
	}, [items, deleteItems]);

	return (
		<LongPressAction
			visible={items.length > 0}
			onActivate={deleteAll}
			duration={2000}
			icon={<TrashIcon />}
		>
			Delete All
		</LongPressAction>
	);
}
