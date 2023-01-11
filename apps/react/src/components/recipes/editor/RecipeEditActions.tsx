import { RedoAction } from '@/components/groceries/actions/RedoAction.jsx';
import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { ActionBar } from '@/components/primitives/actions/ActionBar.jsx';
import { Recipe } from '@aglio/groceries-client';

export interface RecipeEditActionsProps {}

export function RecipeEditActions({}: RecipeEditActionsProps) {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
		</ActionBar>
	);
}