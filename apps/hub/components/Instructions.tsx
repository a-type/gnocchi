import { HubPublishedRecipeInfo } from '@aglio/trpc';
import { H3, P, RichEditor } from '@aglio/ui';
import { useEditor } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

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
				parseHTML: (element) => element.getAttribute('data-id'),
				renderHTML: (attributes) => {
					return {
						'data-id': attributes.id,
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

	renderHTML({ node, HTMLAttributes }) {
		return [
			'p',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				'data-id': node.attrs.id,
			}),
			0,
		];
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
				parseHTML: (element) => element.getAttribute('data-id'),
				renderHTML: (attributes) => {
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

	renderHTML({ HTMLAttributes }) {
		return [
			'h2',
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
			0,
		];
	},
});
