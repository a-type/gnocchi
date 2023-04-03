import { Recipe } from '@aglio/groceries-client';
import { useSyncedPreludeEditor } from '../hooks.js';
import * as classes from './RecipePreludeViewer.css.js';
import { Peek } from '@aglio/ui/components/peek';
import { RichEditor } from '@aglio/ui/components/richEditor';

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
