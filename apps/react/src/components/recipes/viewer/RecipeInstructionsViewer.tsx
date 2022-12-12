import { Recipe } from '@/stores/recipes/index.js';
import { useSyncedInstructionsEditor } from '../hooks.js';
import * as classes from './RecipeInstructionsViewer.css.js';
import { RichEditor } from '@/components/primitives/richEditor/RichEditor.jsx';

export interface RecipeInstructionsViewerProps {
	recipe: Recipe;
}

export function RecipeInstructionsViewer({
	recipe,
}: RecipeInstructionsViewerProps) {
	const editor = useSyncedInstructionsEditor(recipe, true);

	return <RichEditor className={classes.root} editor={editor} />;
}
