import { ActionBar } from '@aglio/ui';
import { ActionButton } from '@aglio/ui';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { ResetIcon, TrashIcon } from '@radix-ui/react-icons';
import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { RedoAction } from '@/components/groceries/actions/RedoAction.jsx';

export interface PantryActionBarProps {}

export function PantryActionBar({}: PantryActionBarProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
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

	if (!items.length) {
		return null;
	}

	return (
		<ActionButton
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
