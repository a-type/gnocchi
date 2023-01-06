import { Checkbox } from '@/components/primitives/index.js';
import { RecipeSession } from '@/stores/recipes/client/index.js';
import { hooks } from '@/stores/recipes/index.js';
import { Node, NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import classnames from 'classnames';
import * as classes from './InstructionStepNodeView.css.js';

export interface InstructionStepNodeViewProps {
	node: {
		attrs: { id: string };
	};
	extension: {
		storage: { session?: RecipeSession };
	};
}

export function InstructionStepNodeView({
	node,
	extension,
	...rest
}: InstructionStepNodeViewProps) {
	const maybeSession = extension.storage.session;
	const maybeCompletedSteps = maybeSession
		? maybeSession.get('completedInstructions')
		: null;
	hooks.useWatch(maybeCompletedSteps);

	const completed = maybeCompletedSteps?.has(node.attrs.id);

	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className={classnames(classes.root, completed && classes.completed)}
		>
			<Checkbox
				checked={completed}
				tabIndex={-1}
				contentEditable={false}
				onCheckedChange={(checked) => {
					if (!maybeCompletedSteps) return;
					if (!node.attrs.id) {
						debugger;
						return;
					}

					if (checked) {
						maybeCompletedSteps.add(node.attrs.id);
					} else {
						maybeCompletedSteps.removeAll(node.attrs.id);
					}
				}}
			/>
			<NodeViewContent />
		</NodeViewWrapper>
	);
}
