// @ts-ignore
import { Button } from '@aglio/ui/components/button';
import { StopwatchIcon } from '@radix-ui/react-icons';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

export interface InstructionTimerNodeViewProps {
	node: {
		attrs: {
			id: string;
		};
	};
	extension: {};
	updateAttributes: (attrs: { id: string }) => void;
}

export function InstructionTimerNodeView({
	node,
}: InstructionTimerNodeViewProps) {
	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className="inline-flex flex-row gap-1 items-center"
		>
			<NodeViewContent />
			<Button contentEditable={false} size="icon" color="ghost">
				<StopwatchIcon />
			</Button>
		</NodeViewWrapper>
	);
}
