import { Recipe } from '@aglio/groceries-client';
import { useSyncedPreludeEditor } from '../hooks.js';
import { Box, RichEditor } from '@aglio/ui';
import * as classes from './RecipeInstructionsField.css.js';

export interface RecipePreludeEditor {
	recipe: Recipe;
}

export function RecipePreludeEditor({ recipe }: RecipePreludeEditor) {
	const editor = useSyncedPreludeEditor(recipe, false);
	return (
		<Box>
			<RichEditor editor={editor} className={classes.editor} />
		</Box>
	);
}
