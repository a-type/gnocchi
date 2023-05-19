import { Icon } from '@/components/icons/Icon.jsx';
import { NoteEditor } from '@/components/recipes/editor/NoteEditor.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { useToggle } from '@aglio/ui/hooks';
import { Button } from '@aglio/ui/src/components/button';
import { Note } from '@aglio/ui/src/components/note';

export interface RecipeNoteProps {
	recipe: Recipe;
	readOnly?: boolean;
	className?: string;
}

export function RecipeNote({ recipe, readOnly, className }: RecipeNoteProps) {
	const { note } = hooks.useWatch(recipe);
	const [showWhenEmpty, toggleShowWhenEmpty] = useToggle(false);

	if (!note && readOnly) {
		return null;
	}

	if (!note && !showWhenEmpty && !readOnly) {
		return (
			<div className={className}>
				<Button size="small" color="default" onClick={toggleShowWhenEmpty}>
					<Icon name="add_note" />
					Add note
				</Button>
			</div>
		);
	}

	if (readOnly) {
		return <Note className={className}>{note}</Note>;
	}

	return (
		<NoteEditor
			value={note || ''}
			onChange={(val) => recipe.set('note', val)}
			autoFocus={showWhenEmpty}
			onBlur={toggleShowWhenEmpty}
			className={className}
		/>
	);
}
