import { RedoAction } from '@/components/groceries/actions/RedoAction.jsx';
import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { ActionBar } from '@a-type/ui/components/actions';

export interface RecipeEditActionsProps {}

export function RecipeEditActions({}: RecipeEditActionsProps) {
	return (
		<ActionBar>
			<UndoAction showName />
			<RedoAction showName />
		</ActionBar>
	);
}
