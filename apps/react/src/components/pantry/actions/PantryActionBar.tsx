import { RedoAction } from '@/components/groceries/actions/RedoAction.jsx';
import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ActionBar, ActionButton } from '@aglio/ui/components/actions';
import { TrashIcon } from '@radix-ui/react-icons';
import { AddItemAction } from './AddItemAction.jsx';

export interface PantryActionBarProps {}

export function PantryActionBar({}: PantryActionBarProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<AddItemAction />
			<DeleteAllAction />
		</ActionBar>
	);
}

function DeleteAllAction() {
	const items = hooks.useAllItems({
		index: {
			where: 'purchased',
			equals: 'yes',
		},
	});
	const deleteItems = hooks.useDeleteItems();

	if (!items.length) {
		return null;
	}

	return (
		<ActionButton
			size="small"
			onClick={() => {
				deleteItems(items.map((i) => i.get('id')));
			}}
			icon={<TrashIcon />}
		>
			Delete All
		</ActionButton>
	);
}
