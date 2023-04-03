import { ActionButton } from '@aglio/ui/components/actions';
import { hooks } from '@/stores/groceries/index.js';
import { ResetIcon } from '@radix-ui/react-icons';

export function RedoAction() {
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
		></ActionButton>
	);
}
