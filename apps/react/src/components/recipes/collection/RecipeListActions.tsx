import { RedoAction } from '@/components/groceries/actions/RedoAction.js';
import { UndoAction } from '@/components/groceries/actions/UndoAction.js';
import { ActionBar } from '@/components/primitives/actions/ActionBar.js';
import { RecipeFilterAction } from './RecipeFilterAction.jsx';

export function RecipeListActions() {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<RecipeFilterAction />
		</ActionBar>
	);
}
