'use client';

import { HubPublishedRecipeInfo } from '@aglio/trpc';
import { Note } from '@a-type/ui/components/note';
import { RichEditor } from '@a-type/ui/components/richEditor';
// @ts-ignore
import { Node, mergeAttributes } from '@tiptap/core';
import {
	// @ts-ignore
	NodeViewContent,
	// @ts-ignore
	NodeViewWrapper,
	// @ts-ignore
	ReactNodeViewRenderer,
	// @ts-ignore
	useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export interface InstructionsProps {
	instructions: HubPublishedRecipeInfo['instructions'];
}

export function Instructions({ instructions }: InstructionsProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				history: false,
			}),
			Step,
			SectionTitle,
			Link,
		],
		content: instructions,
		editable: false,
	});
	return (
		<div className="e-instructions" itemProp="recipeInstructions">
			<RichEditor editor={editor} readOnly />
		</div>
	);
}

const Step = Node.create({
	name: 'step',
	group: 'block',
	content: 'inline*',
	defining: true,
	priority: 1001,

	addAttributes() {
		return {
			id: {
				default: null,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
				renderHTML: (attributes: any) => {
					return {
						'data-id': attributes.id,
					};
				},
			},
			note: {
				default: undefined,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) => element.getAttribute('data-note'),
				renderHTML: (attributes: any) => {
					return {
						'data-note': attributes.note,
					};
				},
			},
		};
	},

	addOptions() {
		return {
			HTMLAttributes: {},
		};
	},

	parseHTML() {
		return [{ tag: 'p' }];
	},

	renderHTML({ node, HTMLAttributes }: any) {
		return [
			'p',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-id': node.attrs.id,
			}),
			0,
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(InstructionStepView);
	},
});

const SectionTitle = Node.create({
	name: 'sectionTitle',
	content: 'inline*',
	defining: true,
	group: 'block',

	addAttributes() {
		return {
			id: {
				default: null,
				keepOnSplit: false,
				rendered: false,
				parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
				renderHTML: (attributes: any) => {
					return {
						'data-id': attributes.id,
					};
				},
			},
		};
	},

	parseHTML() {
		return [{ tag: 'h2' }, { tag: 'h1' }, { tag: 'h3' }];
	},

	renderHTML({ HTMLAttributes }: any) {
		return [
			'h2',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
			0,
		];
	},
});

function InstructionStepView({
	node,
}: {
	node: {
		attrs: {
			id: string;
			note?: string;
		};
	};
}) {
	return (
		<NodeViewWrapper
			data-id={node.attrs.id}
			className="flex flex-col mb-5 w-full p-1"
			contentEditable={false}
		>
			<div>
				<NodeViewContent />
			</div>
			{node.attrs.note && (
				<Note className="mt-2 ml-8 max-w-80% w-max-content">
					{node.attrs.note}
				</Note>
			)}
		</NodeViewWrapper>
	);
}
