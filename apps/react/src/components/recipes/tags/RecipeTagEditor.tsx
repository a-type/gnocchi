import { recipeTagEditorState } from '@/components/recipes/tags/recipeTagEditorState.js';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@aglio/ui/src/components/button';
import { ColorPicker, ThemeName } from '@aglio/ui/src/components/colorPicker';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@aglio/ui/src/components/dialog';
import { useSnapshot } from 'valtio';

export interface RecipeTagEditorProps {}

export function RecipeTagEditor() {
	const editingTag = useSnapshot(recipeTagEditorState).editingTag;
	const tag = hooks.useRecipeTagMetadata(editingTag || '', {
		skip: !editingTag,
	});
	hooks.useWatch(tag);

	return (
		<Dialog
			open={!!editingTag}
			onOpenChange={(open) => {
				if (!open) {
					recipeTagEditorState.editingTag = null;
				}
			}}
		>
			<DialogContent>
				<DialogTitle>Edit {tag?.get('name')}</DialogTitle>
				<div className="flex gap-3">
					<div>Color:</div>
					<ColorPicker
						onChange={(color) => tag?.set('color', color)}
						value={tag?.get('color') as ThemeName | null}
					/>
				</div>

				<DialogActions>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
