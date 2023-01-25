import { ActionBar } from '@/components/primitives/actions/ActionBar.jsx';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { CheckboxIcon, ResetIcon, TrashIcon } from '@radix-ui/react-icons';
import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import { useListId } from '@/contexts/ListContext.jsx';
import { UndoAction } from './UndoAction.jsx';
import { RedoAction } from './RedoAction.jsx';
import { MeetupAction } from './MeetupAction.jsx';
import { People } from '@/components/sync/people/People.jsx';
import * as classes from './GroceriesActionBar.css.js';

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
