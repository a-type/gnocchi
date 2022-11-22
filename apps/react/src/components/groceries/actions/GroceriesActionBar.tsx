import { ActionBar } from '@/components/primitives/actions/ActionBar.jsx';
import { groceries, hooks } from '@/stores/groceries/index.js';
import { CheckboxIcon, ResetIcon, TrashIcon } from '@radix-ui/react-icons';
import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';

export interface GroceriesActionBarProps {}

export function GroceriesActionBar({}: GroceriesActionBarProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<PurchaseAllAction />
			<DeleteAllAction />
		</ActionBar>
	);
}

function PurchaseAllAction() {
	const items = hooks.useAllItems({
		index: {
			where: 'purchased',
			equals: 'no',
		},
	});

	if (!items.length) {
		return null;
	}

	return (
		<ActionButton
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
			equals: 'no',
		},
	});

	if (!items.length) {
		return null;
	}

	return (
		<ActionButton
			size="small"
			onClick={() => {
				const confirmed = confirm('Are you sure you want to delete all items?');
				if (confirmed) {
					groceries.deleteItems(items.map((i) => i.get('id')));
				}
			}}
			icon={<TrashIcon />}
		>
			Delete All
		</ActionButton>
	);
}
