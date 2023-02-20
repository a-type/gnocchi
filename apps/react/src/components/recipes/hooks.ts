import {
	Entity,
	ObjectEntity,
	Recipe,
	RecipeDestructured,
} from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import { ExtensionConfig, useEditor } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createTiptapExtensions } from './editor/tiptapExtensions.js';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback.js';
import StarterKit from '@tiptap/starter-kit';

export function useRecipeFromSlugUrl(url: string) {
	const slug = url.split('-').pop();
	const recipe = hooks.useOneRecipe({
		index: {
			where: 'slug',
			equals: slug,
		},
		// TODO: update lo-fi types to add |null
	});
	hooks.useWatch(recipe);
	return recipe;
}

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;
const THIRTY_MINUTES = 1000 * 60 * 30;
// for local development (defined by env var), use five minutes

const SESSION_TIMEOUT = import.meta.env.DEV ? THIRTY_MINUTES : TWO_DAYS;
export function useCurrentRecipeSession(recipe: Recipe) {
	const live = hooks.useWatch(recipe);
	const client = hooks.useClient();
	let session = live.session;
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
				session = recipe.get('session')!;
			})
			.flush();
	}
	return session!;
}

export function useSyncedInstructionsEditor(recipe: Recipe, readonly = false) {
	useCurrentRecipeSession(recipe);
	return useSyncedEditor(
		recipe,
		'instructions',
		readonly,
		createTiptapExtensions(recipe, readonly),
	);
}

export function useSyncedPreludeEditor(recipe: Recipe, readonly = false) {
	return useSyncedEditor(recipe, 'prelude', readonly, [StarterKit]);
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
		(editor) => {
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
		[field],
	);

	useEffect(() => {
		if (editor && !editor.isDestroyed && field) {
			updatingRef.current = true;
			editor.commands.setContent(field.getSnapshot(), false);
			updatingRef.current = false;
		}

		return field?.subscribe('changeDeep', (target, info) => {
			if (!info.isLocal || target === field) {
				updatingRef.current = true;
				editor?.commands.setContent(field.getSnapshot(), false);
				updatingRef.current = false;
			}
		});
	}, [field, editor]);

	return editor;
}
