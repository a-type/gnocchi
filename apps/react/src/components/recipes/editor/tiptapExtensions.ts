import { mergeAttributes, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import { Recipe } from '@aglio/groceries-client';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InstructionStepNodeView } from './InstructionStepNodeView.jsx';
import { Plugin, PluginKey } from 'prosemirror-state';
import cuid from 'cuid';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		step: {
			setStep: () => ReturnType;
		};
		sectionTitle: {
			setSectionTitle: () => ReturnType;
		};
	}
}

interface StepOptions {
	HTMLAttributes: Record<string, any>;
}

interface SectionTitleOptions {
	HTMLAttributes: Record<string, any>;
}

export function createTiptapExtensions(recipe?: Recipe) {
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

		addNodeView() {
			return ReactNodeViewRenderer(InstructionStepNodeView);
		},
	});

	const SectionTitle = Node.create<SectionTitleOptions>({
		name: 'sectionTitle',
		content: 'inline*',
		defining: true,

		parseHTML() {
			return [{ tag: 'h2' }];
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
			};
		},
	});

	const RecipeDocument = Document.extend({
		// the recipe document may only contain steps and section titles at the top level
		// and must contain at least one step
		content: 'step+',

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
					appendTransaction: (_, oldState, newState) => {
						// no changes
						if (newState.doc === oldState.doc) return;
						const tr = newState.tr;
						const usedIds = new Set<string>();
						newState.doc.descendants((node, pos, parent) => {
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
		RecipeDocument,
	];
}
