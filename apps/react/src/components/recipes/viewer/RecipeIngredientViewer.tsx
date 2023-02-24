import { RecipeIngredientsItem } from '@aglio/groceries-client';
import { IngredientText } from './IngredientText.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	Note,
	useToggle,
} from '@aglio/ui';
import classNames from 'classnames';
import * as classes from './RecipeIngredientViewer.css.js';
import { NoteIcon } from '@/components/icons/NoteIcon.jsx';
import { AddNoteIcon } from '@/components/icons/AddNoteIcon.jsx';
import { NoteEditor } from '../editor/NoteEditor.jsx';
import { useCallback } from 'react';

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
	className?: string;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
	className,
}: RecipeIngredientViewerProps) {
	const note = hooks.useWatch(ingredient, 'note');

	const [showNote, toggleShowNote] = useToggle(false);

	const onNoteBlur = useCallback(() => {
		if (!note) {
			toggleShowNote();
		}
	}, [note, toggleShowNote]);

	return (
		<div className={classNames(classes.root, className)}>
			<div className={classes.mainRow}>
				<IngredientText
					className={classes.text}
					multiplier={multiplier}
					ingredient={ingredient}
				/>
				<Button size="icon" color="ghost" onClick={toggleShowNote}>
					{!!note ? (
						<NoteIcon
							className={showNote ? undefined : classes.noteIconWithNote}
						/>
					) : (
						<AddNoteIcon />
					)}
				</Button>
			</div>
			<CollapsibleRoot open={showNote}>
				<CollapsibleContent>
					<NoteEditor
						value={note || ''}
						onChange={(val) => ingredient.set('note', val)}
						autoFocus={!note}
						onBlur={onNoteBlur}
					/>
				</CollapsibleContent>
			</CollapsibleRoot>
		</div>
	);
}
