import { ActionButton } from '@a-type/ui/components/actions';
import { hooks } from '@/stores/groceries/index.js';
import { ResetIcon } from '@radix-ui/react-icons';
import { Tooltip } from '@a-type/ui/components/tooltip';

export function UndoAction({ showName }: { showName?: boolean }) {
	const canUndo = hooks.useCanUndo();
	const groceries = hooks.useClient();

	return (
		<Tooltip content={!canUndo ? 'Nothing to undo' : 'Undo'}>
			<ActionButton
				size="small"
				onClick={() => {
					groceries.undoHistory.undo();
				}}
				icon={<ResetIcon />}
				visuallyDisabled={!canUndo}
			>
				{showName ? 'Undo' : undefined}
			</ActionButton>
		</Tooltip>
	);
}
