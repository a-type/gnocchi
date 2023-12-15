import { ActionButton } from '@a-type/ui/components/actions';
import { hooks } from '@/stores/groceries/index.js';
import { ResetIcon } from '@radix-ui/react-icons';

export function RedoAction({ showName }: { showName?: boolean }) {
	const canRedo = hooks.useCanRedo();
	const groceries = hooks.useClient();

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.undoHistory.redo();
			}}
			icon={<ResetIcon style={{ transform: 'scaleX(-1)' }} />}
			visible={canRedo}
		>
			{showName ? 'Redo' : undefined}
		</ActionButton>
	);
}
