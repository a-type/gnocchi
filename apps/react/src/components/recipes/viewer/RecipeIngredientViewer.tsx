import { Icon } from '@/components/icons/Icon.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { RecipeIngredientsItem } from '@aglio/groceries-client';
import {
	Button,
	CollapsibleContent,
	CollapsibleRoot,
	useToggle,
} from '@aglio/ui';
import classNames from 'classnames';
import { useCallback } from 'react';
import { NoteEditor } from '../editor/NoteEditor.jsx';
import { IngredientText } from './IngredientText.jsx';
import * as classes from './RecipeIngredientViewer.css.js';

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
	className?: string;
	disableAddNote?: boolean;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
	className,
	disableAddNote,
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
				{!disableAddNote && (
					<Button size="icon" color="ghost" onClick={toggleShowNote}>
						{!!note ? (
							<Icon
								name="note"
								className={showNote ? undefined : classes.noteIconWithNote}
							/>
						) : (
							<Icon name="add_note" />
						)}
					</Button>
				)}
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
