import { RedoAction } from '@/components/groceries/actions/RedoAction.js';
import { UndoAction } from '@/components/groceries/actions/UndoAction.js';
import { ActionBar } from '@a-type/ui/components/actions';
import {
	RecipeFoodFilterAction,
	RecipeTagFilterAction,
} from './RecipeFilterAction.jsx';

export function RecipeListActions() {
	return (
		<ActionBar>
			<UndoAction />
			<RedoAction />
			<RecipeTagFilterAction />
			<RecipeFoodFilterAction />
		</ActionBar>
	);
}
