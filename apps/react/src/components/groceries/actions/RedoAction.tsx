import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { ResetIcon } from '@radix-ui/react-icons';

export function RedoAction() {
	const canRedo = hooks.useCanRedo();
	const groceries = hooks.useClient();

	if (!canRedo) {
		return null;
	}

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.undoHistory.redo();
			}}
			icon={<ResetIcon style={{ transform: 'scaleX(-1)' }} />}
		>
			Redo
		</ActionButton>
	);
}