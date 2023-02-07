import { People } from '@/components/sync/people/People.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { ActionBar, ActionButton } from '@aglio/ui';
import { CheckboxIcon, TrashIcon } from '@radix-ui/react-icons';
import * as classes from './GroceriesActionBar.css.js';
import { MeetupAction } from './MeetupAction.jsx';
import { RedoAction } from './RedoAction.jsx';
import { UndoAction } from './UndoAction.jsx';

export interface GroceriesActionBarProps {}

export function GroceriesActionBar({}: GroceriesActionBarProps) {
	return (
		<ActionBar>
			<People avatarClassName={classes.avatar} hideIfAlone />
			<MeetupAction />
			<UndoAction />
			<RedoAction />
			<PurchaseAllAction />
			<DeleteAllAction />
		</ActionBar>
	);
}

function PurchaseAllAction() {
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

	return (
		<ActionButton
			visible={items.length > 0}
			size="small"
			onClick={() => {
				groceries.purchaseItems(items);
			}}
			icon={<CheckboxIcon />}
		>
			Purchase All
		</ActionButton>
	);
}

function DeleteAllAction() {
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

	return (
		<ActionButton
			visible={items.length > 0}
			size="small"
			onClick={() => {
				groceries.deleteItems(items.map((i) => i.get('id')));
			}}
			icon={<TrashIcon />}
		>
			Delete All
		</ActionButton>
	);
}
