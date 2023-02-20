import { Recipe } from '@aglio/groceries-client';
import { Peek, RichEditor } from '@aglio/ui';
import { useSyncedPreludeEditor } from '../hooks.js';
import * as classes from './RecipePreludeViewer.css.js';

export interface RecipePreludeViewerProps {
	recipe: Recipe;
}

export function RecipePreludeViewer({ recipe }: RecipePreludeViewerProps) {
	const editor = useSyncedPreludeEditor(recipe, true);

	return (
		<div className={classes.root}>
			<Peek>
				<RichEditor editor={editor} readOnly className={classes.editor} />
			</Peek>
		</div>
	);
}
