import { RedoAction } from '../groceries/actions/RedoAction.jsx';
import { UndoAction } from '../groceries/actions/UndoAction.jsx';
import { ActionBar } from '../primitives/actions/ActionBar.jsx';

export function RecipeListActions() {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
		</ActionBar>
	);
}
