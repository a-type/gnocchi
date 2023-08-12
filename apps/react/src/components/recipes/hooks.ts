import {
	ObjectEntity,
	Recipe,
	RecipeDestructured,
	RecipeSession,
} from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
// @ts-ignore
import { ExtensionConfig, useEditor } from '@tiptap/react';
import { useCallback, useEffect, useRef } from 'react';
import { createTiptapExtensions } from './editor/tiptapExtensions.js';
import StarterKit from '@tiptap/starter-kit';
import { SESSION_TIMEOUT } from '@/components/recipes/constants.js';
import Link from '@tiptap/extension-link';
import { assert } from '@aglio/tools';

export function useRecipeFromSlugUrl(url: string) {
	const slug = url.split('-').pop();
	const recipe = hooks.useOneRecipe({
		index: {
			where: 'slug',
			equals: slug,
		},
	});
	hooks.useWatch(recipe);
	return recipe;
}

/**
 * Clears any expired session, forces that a session exists,
 * then runs the action with that session.
 */
export function useCookSessionAction(recipe: Recipe | null) {
	const client = hooks.useClient();
	return useCallback(
		(action: (session: RecipeSession) => void) => {
			if (!recipe) {
				return;
			}
			let session = recipe.get('session');
			if (!session || session.get('startedAt') < Date.now() - SESSION_TIMEOUT) {
				client
					.batch({ undoable: false })
					.run(() => {
						recipe.set('session', {
							completedIngredients: [],
							completedInstructions: [],
							ingredientAssignments: {},
							instructionAssignments: {},
							startedAt: Date.now(),
						});
						recipe.set('cookCount', recipe.get('cookCount') + 1);
						recipe.set('lastCookedAt', Date.now());
						session = recipe.get('session');
					})
					.flush();
			}
			assert(session);
			action(session);
		},
		[recipe, client],
	);
}

export function useActiveCookingSession(recipe: Recipe) {
	const session = hooks.useWatch(recipe, 'session');
	if (!session) {
		return null;
	}
	return isActiveCookingSession(session) ? session : null;
}

export function isActiveCookingSession(session: RecipeSession | null) {
	if (!session) {
		return false;
	}
	return session.get('startedAt') > Date.now() - SESSION_TIMEOUT;
}

export function useSyncedInstructionsEditor({
	recipe,
	readonly = false,
	useBasicEditor = false,
}: {
	recipe: Recipe;
	readonly?: boolean;
	useBasicEditor?: boolean;
}) {
	return useSyncedEditor(
		recipe,
		'instructions',
		readonly,
		createTiptapExtensions(recipe, useBasicEditor),
	);
}

export function useSyncedPreludeEditor(recipe: Recipe, readonly = false) {
	return useSyncedEditor(recipe, 'prelude', readonly, [StarterKit, Link]);
}

function useSyncedEditor(
	recipe: Recipe,
	fieldName: keyof RecipeDestructured,
	readonly: boolean,
	extensions: ExtensionConfig[],
) {
	const live = hooks.useWatch(recipe);
	const field = live[fieldName] as ObjectEntity<any, any>;
	const updatingRef = useRef(false);
	const update = useCallback(
		(editor: any) => {
			if (updatingRef.current) {
				return;
			}

			const newData = editor.getJSON();
			const value = recipe.get(fieldName);
			if (!value) {
				recipe.set(fieldName, newData);
			} else {
				value.update(newData, {
					merge: false,
					replaceSubObjects: false,
				});
			}
		},
		[recipe],
	);

	const editor = useEditor(
		{
			extensions,
			content: field?.getSnapshot() ?? {
				type: 'doc',
				content: [],
			},
			editable: !readonly,
			onUpdate: ({ editor }) => {
				update(editor);
			},
		},
		[field, update],
	);

	useEffect(() => {
		if (editor && !editor.isDestroyed && field) {
			updatingRef.current = true;
			const { from, to } = editor.state.selection;
			editor.commands.setContent(field.getSnapshot(), false);
			editor.commands.setTextSelection({ from, to });
			updatingRef.current = false;
		}

		return field?.subscribe('changeDeep', (target, info) => {
			if (!info.isLocal || target === field) {
				updatingRef.current = true;
				const { from, to } = editor.state.selection;
				editor?.commands.setContent(field.getSnapshot(), false);
				editor?.commands?.setTextSelection({ from, to });
				updatingRef.current = false;
			}
		});
	}, [field, editor]);

	return editor;
}

/**
 * Updates the updatedAt timestamp for any changes to
 * instructions, ingredients, or prelude.
 */
export function useWatchChanges(recipe: Recipe) {
	const { ingredients, instructions, prelude } = hooks.useWatch(recipe);

	useEffect(() => {
		const unsubs = new Array<() => void>();
		const updateTime = () => {
			recipe.set('updatedAt', Date.now());
		};
		unsubs.push(ingredients.subscribe('changeDeep', updateTime));
		unsubs.push(instructions.subscribe('changeDeep', updateTime));
		unsubs.push(prelude.subscribe('changeDeep', updateTime));
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [ingredients, instructions, prelude]);
}
