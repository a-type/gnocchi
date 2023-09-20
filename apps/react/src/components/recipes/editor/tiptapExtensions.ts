import {
	mergeAttributes,
	Node,
	textblockTypeInputRule,
	wrappingInputRule,
	nodeInputRule,
} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import { Recipe } from '@aglio/groceries-client';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InstructionStepNodeView } from './InstructionStepNodeView.jsx';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import cuid from 'cuid';
import Link from '@tiptap/extension-link';
import { InstructionTimerNodeView } from '@/components/recipes/editor/InstructionTimerNodeView.jsx';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		step: {
			setStep: () => ReturnType;
		};
		sectionTitle: {
			setSectionTitle: () => ReturnType;
			toggleSectionTitle: () => ReturnType;
		};
		timer: {
			setTimer: () => ReturnType;
			toggleTimer: () => ReturnType;
		};
	}
}

interface StepOptions {
	HTMLAttributes: Record<string, any>;
}

interface SectionTitleOptions {
	HTMLAttributes: Record<string, any>;
}

interface TimerOptions {
	HTMLAttributes: Record<string, any>;
}

export function createTiptapExtensions(recipe?: Recipe, basicEditor = false) {
	const Step = Node.create<StepOptions, { recipe?: Recipe }>({
		name: 'step',

		group: 'block',
		content: 'inline*',
		defining: true,
		priority: 1001,

		addOptions() {
			return {
				HTMLAttributes: {},
			};
		},

		addStorage() {
			return {
				recipe,
			};
		},

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
				note: {
					default: undefined,
					keepOnSplit: false,
					rendered: false,
					parseHTML: (element) => element.getAttribute('data-note'),
					renderHTML: (attributes) => {
						return {
							'data-note': attributes.note,
						};
					},
				},
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

		addCommands() {
			return {
				setStep:
					() =>
					({ commands }) => {
						return commands.setNode(this.name);
					},
			};
		},

		...(!basicEditor
			? {
					addNodeView() {
						return ReactNodeViewRenderer(InstructionStepNodeView);
					},
			  }
			: {}),
	});

	const SectionTitle = Node.create<SectionTitleOptions>({
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
		addCommands() {
			return {
				setSectionTitle:
					() =>
					({ commands }) => {
						return commands.setNode(this.name);
					},
				toggleSectionTitle:
					() =>
					({ commands }) => {
						return commands.toggleNode(this.name, 'step');
					},
			};
		},
		addInputRules() {
			return [
				textblockTypeInputRule({
					find: /^#\s$/,
					type: this.type,
				}),
			];
		},
	});

	const Timer = Node.create<TimerOptions>({
		name: 'timer',
		group: 'inline',
		inline: true,
		selectable: false,
		atom: true,
		content: 'text?',

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
			return [{}];
		},

		renderHTML({ HTMLAttributes }) {
			return [
				'div',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
				0,
			];
		},

		addCommands() {
			return {
				toggleTimer:
					() =>
					({ commands }) => {
						return commands.toggleWrap(this.name);
					},
			};
		},

		addInputRules() {
			return [
				// wrappingInputRule({
				// 	find: /\d+\smin(ute)?s?\s$/,
				// 	type: this.type,
				// 	keepMarks: true,
				// 	keepAttributes: true,
				// 	editor: this.editor,
				// }),
				nodeInputRule({
					find: /\d+\smin(ute)?s?\s$/,
					type: this.type,
				}),
			];
		},

		...(!basicEditor
			? {
					addNodeView() {
						return ReactNodeViewRenderer(InstructionTimerNodeView);
					},
			  }
			: {}),
	});

	const RecipeDocument = Document.extend({
		// the recipe document may only contain steps and section titles at the top level
		// and must contain at least one step
		content: '(step|sectionTitle)+',

		addProseMirrorPlugins() {
			return [
				/**
				 * This plugin adds a unique ID to every step and section title node
				 * that doesn't already have one. This is used to identify the node
				 * when it is rendered in the editor and when users complete
				 * different steps.
				 */
				new Plugin({
					key: new PluginKey('step-ids'),
					appendTransaction: (_: any, oldState: any, newState: any) => {
						// no changes
						if (newState.doc === oldState.doc) return;
						const tr = newState.tr;
						const usedIds = new Set<string>();
						newState.doc.descendants((node: any, pos: any, parent: any) => {
							if (
								(node.type.name === 'step' ||
									node.type.name === 'sectionTitle') &&
								(!node.attrs.id || usedIds.has(node.attrs.id))
							) {
								const id = cuid();
								tr.setNodeMarkup(pos, node.type, {
									...node.attrs,
									id,
								});
								usedIds.add(id);
							} else {
								usedIds.add(node.attrs.id);
							}
						});
						return tr;
					},
				}),
			];
		},
	});

	// Until tiptap is full ESM, these types won't work...
	return [
		// @ts-ignore
		StarterKit.configure({ history: false, document: false }),
		Step,
		SectionTitle,
		Timer,
		RecipeDocument,
		Link,
	];
}
