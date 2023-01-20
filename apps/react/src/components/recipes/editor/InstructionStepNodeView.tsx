import { Checkbox } from '@/components/primitives/index.js';
import { Recipe } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import classnames from 'classnames';
import * as classes from './InstructionStepNodeView.css.js';
import { PersonSelect } from '@/components/sync/people/PersonSelect.jsx';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import { useIsSubscribed } from '@/contexts/AuthContext.jsx';

export interface InstructionStepNodeViewProps {
	node: {
		attrs: { id: string };
	};
	extension: {
		storage: { recipe?: Recipe };
	};
}

export function InstructionStepNodeView({
	node,
	extension,
	...rest
}: InstructionStepNodeViewProps) {
	const self = hooks.useSelf();
	const { isEditing, hasPeers } = useContext(InstructionsContext);

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

	const completed = maybeCompletedSteps?.has(node.attrs.id);

	const assignedPersonId = maybeAssignments?.get(node.attrs.id) ?? null;

	const assignPersonId = useCallback(
		(personId: string | null) => {
			if (personId) {
				maybeAssignments?.set(node.attrs.id, personId);
			} else {
				maybeAssignments?.delete(node.attrs.id);
			}
		},
		[maybeAssignments, node.attrs.id],
	);

	const isAssignedToMe = hasPeers && assignedPersonId === self.id;

	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className={classnames(
				classes.root,
				completed && classes.completed,
				isAssignedToMe && classes.assignedToMe,
			)}
			contentEditable={false}
		>
			<div className={classes.content}>
				<NodeViewContent />
			</div>
			{!isEditing && isAssignedToMe && (
				<label contentEditable={false} className={classes.label}>
					Assigned to you
				</label>
			)}
			<div className={classes.tools} contentEditable={false}>
				<Checkbox
					checked={!isEditing && completed}
					disabled={isEditing}
					tabIndex={-1}
					contentEditable={false}
					onCheckedChange={(checked) => {
						if (!maybeCompletedSteps) return;
						if (!node.attrs.id) {
							return;
						}

						if (checked) {
							maybeCompletedSteps.add(node.attrs.id);
						} else {
							maybeCompletedSteps.removeAll(node.attrs.id);
						}
					}}
				/>
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
		</NodeViewWrapper>
	);
}

export const InstructionsContext = createContext<{
	isEditing: boolean;
	hasPeers: boolean;
}>({
	isEditing: false,
	hasPeers: false,
});

export const InstructionsProvider = ({
	isEditing,
	recipeId,
	children,
}: {
	recipeId: string;
	isEditing: boolean;
	children: ReactNode;
}) => {
	const hasPeers =
		hooks.useFindPeers((peer) => peer.presence.viewingRecipeId === recipeId)
			.length > 0;
	const value = useMemo(() => ({ isEditing, hasPeers }), [isEditing, hasPeers]);
	return (
		<InstructionsContext.Provider value={value}>
			{children}
		</InstructionsContext.Provider>
	);
};
