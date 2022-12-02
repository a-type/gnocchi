import { ActionBar } from '@/components/primitives/actions/ActionBar.jsx';
import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { ResetIcon, TrashIcon } from '@radix-ui/react-icons';

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

function UndoAction() {
	const canUndo = hooks.useCanUndo();

	if (!canUndo) {
		return null;
	}

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.undo();
			}}
			icon={<ResetIcon />}
		>
			Undo
		</ActionButton>
	);
}

function RedoAction() {
	const canRedo = hooks.useCanRedo();

	if (!canRedo) {
		return null;
	}

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.redo();
			}}
			icon={<ResetIcon style={{ transform: 'scaleX(-1)' }} />}
		>
			Redo
		</ActionButton>
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
