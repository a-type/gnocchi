import { RedoAction } from '@/components/groceries/actions/RedoAction.jsx';
import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { ActionBar } from '@a-type/ui/components/actions';
import { AddItemAction } from './AddItemAction.jsx';

export interface PantryActionBarProps {}

export function PantryActionBar({}: PantryActionBarProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<AddItemAction />
		</ActionBar>
	);
}
