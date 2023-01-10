import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ResetIcon } from '@radix-ui/react-icons';

export function UndoAction() {
	const canUndo = hooks.useCanUndo();
	const groceries = hooks.useClient();

	if (!canUndo) {
		return null;
	}

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.undoHistory.undo();
			}}
			icon={<ResetIcon />}
		>
			Undo
		</ActionButton>
	);
}
