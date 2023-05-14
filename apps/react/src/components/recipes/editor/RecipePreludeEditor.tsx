import { Recipe } from '@aglio/groceries-client';
import { useSyncedPreludeEditor } from '../hooks.js';
import { Box } from '@aglio/ui/components/box';
import { RichEditor } from '@aglio/ui/components/richEditor';

export interface RecipePreludeEditor {
	recipe: Recipe;
}

export function RecipePreludeEditor({ recipe }: RecipePreludeEditor) {
	const editor = useSyncedPreludeEditor(recipe, false);
	return (
		<Box>
			<RichEditor
				editor={editor}
				className="[&>.ProseMirror]:(bg-gray1 rounded-md p-4 border-default)"
			/>
		</Box>
	);
}
