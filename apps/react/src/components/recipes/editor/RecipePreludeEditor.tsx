import { Recipe } from '@aglio/groceries-client';
import { useSyncedPreludeEditor } from '../hooks.js';
import { RichEditor } from '@aglio/ui/components/richEditor';

export interface RecipePreludeEditor {
	recipe: Recipe;
}

export function RecipePreludeEditor({ recipe }: RecipePreludeEditor) {
	const editor = useSyncedPreludeEditor(recipe, false);
	return (
		<div>
			<RichEditor
				editor={editor}
				className="[&>.ProseMirror]:(bg-gray1 rounded-lg p-4 border-default)"
			/>
		</div>
	);
}
