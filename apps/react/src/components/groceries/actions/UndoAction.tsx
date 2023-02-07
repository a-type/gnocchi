import { ActionButton } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { ResetIcon } from '@radix-ui/react-icons';

export function UndoAction() {
	const canUndo = hooks.useCanUndo();
	const groceries = hooks.useClient();

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.undoHistory.undo();
			}}
			icon={<ResetIcon />}
			visible={canUndo}
		>
			Undo
		</ActionButton>
	);
}
