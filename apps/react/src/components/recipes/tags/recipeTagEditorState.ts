import { proxy } from 'valtio';

export const recipeTagEditorState = proxy({
	editingTag: null as string | null,
});
