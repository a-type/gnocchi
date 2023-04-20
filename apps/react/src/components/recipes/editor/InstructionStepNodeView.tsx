import { Icon } from '@/components/icons/Icon.jsx';
import { PersonSelect } from '@/components/sync/people/PersonSelect.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import classNames from 'classnames';
import {
	ChangeEvent,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import * as classes from './InstructionStepNodeView.css.js';
import {
	CollapsibleContent,
	CollapsibleRoot,
} from '@aglio/ui/components/collapsible';
import { TextArea } from '@aglio/ui/components/textArea';
import { Note } from '@aglio/ui/components/note';
import { Checkbox } from '@aglio/ui/components/checkbox';
import { Tooltip } from '@aglio/ui/components/tooltip';
import { Button } from '@aglio/ui/components/button';
import { useToggle } from '@aglio/ui/hooks';

export interface InstructionStepNodeViewProps {
	node: {
		attrs: { id: string; note?: string };
	};
	extension: {
		storage: { recipe?: Recipe };
	};
	updateAttributes: (attrs: { id?: string; note?: string }) => void;
}

export function InstructionStepNodeView({
	node,
	extension,
	updateAttributes,
	...rest
}: InstructionStepNodeViewProps) {
	const self = hooks.useSelf();
	const { isEditing, hasPeers, showTools } = useContext(InstructionsContext);

	const { id, note } = node.attrs;

	const [showNote, toggleShowNote] = useToggle(false);

	const maybeRecipe = extension.storage.recipe;
	hooks.useWatch(maybeRecipe || null);
	const maybeSession = maybeRecipe?.get('session');
	hooks.useWatch(maybeSession || null);
	const maybeCompletedSteps = maybeSession
		? maybeSession.get('completedInstructions')
		: null;
	hooks.useWatch(maybeCompletedSteps);
	const maybeAssignments = maybeSession
		? maybeSession.get('instructionAssignments')
		: null;
	hooks.useWatch(maybeAssignments);

	const completed = maybeCompletedSteps?.has(id);

	const assignedPersonId = maybeAssignments?.get(id) ?? null;

	const assignPersonId = useCallback(
		(personId: string | null) => {
			if (personId) {
				maybeAssignments?.set(id, personId);
			} else {
				maybeAssignments?.delete(id);
			}
		},
		[maybeAssignments, id],
	);

	const isAssignedToMe = hasPeers && assignedPersonId === self.id;

	const onNoteButtonClick = useCallback(() => {
		updateAttributes({ note: '' });
	}, [updateAttributes]);

	const updateNote = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			updateAttributes({ note: event.target.value });
		},
		[updateAttributes],
	);

	const onNoteBlur = useCallback(() => {
		if (note === '') {
			updateAttributes({ note: undefined });
		}
	}, [note, updateAttributes]);

	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className={classNames(
				classes.root,
				completed && classes.completed,
				isAssignedToMe && classes.assignedToMe,
			)}
		>
			<div className={classes.content}>
				<NodeViewContent />
			</div>
			<CollapsibleRoot
				open={showNote}
				className={classes.noteContainer}
				contentEditable={false}
			>
				<CollapsibleContent>
					<Note className={classes.note} contentEditable={false}>
						<TextArea
							className={classes.noteEditor}
							value={note || ''}
							onChange={updateNote}
							onBlur={onNoteBlur}
							autoSize
							autoFocus={note === ''}
						/>
					</Note>
				</CollapsibleContent>
			</CollapsibleRoot>
			{!isEditing && isAssignedToMe && (
				<label contentEditable={false} className={classes.label}>
					Assigned to you
				</label>
			)}
			{showTools && (
				<div className={classes.tools} contentEditable={false}>
					{!isEditing && (
						<Checkbox
							checked={!isEditing && completed}
							tabIndex={-1}
							contentEditable={false}
							onCheckedChange={(checked) => {
								if (!maybeCompletedSteps) return;
								if (!id) {
									return;
								}

								if (checked) {
									maybeCompletedSteps.add(id);
								} else {
									maybeCompletedSteps.removeAll(id);
								}
							}}
						/>
					)}
					{!isEditing && hasPeers && (
						<PersonSelect
							includeSelf
							allowNone
							value={assignedPersonId}
							onChange={assignPersonId}
							label="Assign to:"
						/>
					)}
				</div>
			)}
			<div className={classes.endTools} contentEditable={false}>
				<Tooltip content={note === undefined ? 'Add a note' : 'Show note'}>
					<Button color="ghost" size="icon" onClick={toggleShowNote}>
						{!!note ? (
							<Icon
								name="note"
								className={showNote ? undefined : classes.noteIconWithNote}
							/>
						) : (
							<Icon name="add_note" className={classes.addNoteIcon} />
						)}
					</Button>
				</Tooltip>
			</div>
		</NodeViewWrapper>
	);
}

export const InstructionsContext = createContext<{
	isEditing: boolean;
	hasPeers: boolean;
	showTools: boolean;
}>({
	isEditing: false,
	hasPeers: false,
	showTools: false,
});

export const InstructionsProvider = ({
	isEditing,
	recipeId,
	children,
	showTools,
}: {
	recipeId: string;
	isEditing: boolean;
	showTools: boolean;
	children: ReactNode;
}) => {
	const hasPeers =
		hooks.useFindPeers((peer) => peer.presence.viewingRecipeId === recipeId)
			.length > 0;
	const value = useMemo(
		() => ({ isEditing, hasPeers, showTools }),
		[isEditing, hasPeers, showTools],
	);
	return (
		<InstructionsContext.Provider value={value}>
			{children}
		</InstructionsContext.Provider>
	);
};
