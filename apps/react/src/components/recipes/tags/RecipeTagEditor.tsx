import { recipeTagEditorState } from '@/components/recipes/tags/recipeTagEditorState.js';
import { hooks } from '@/stores/groceries/index.js';
import { Box } from '@aglio/ui/src/components/box';
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
				<Box direction="row" gap={3}>
					<Box>Color:</Box>
					<ColorPicker
						onChange={(color) => tag?.set('color', color)}
						value={tag?.get('color') as ThemeName | null}
					/>
				</Box>

				<DialogActions>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
