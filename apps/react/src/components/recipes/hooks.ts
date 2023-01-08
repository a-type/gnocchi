import { ObjectEntity, Recipe } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import { useEditor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { createTiptapExtensions } from './editor/tiptapExtensions.js';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback.js';

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

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;
const THIRTY_MINUTES = 1000 * 60 * 30;
// for local development (defined by env var), use five minutes

const SESSION_TIMEOUT = import.meta.env.DEV ? THIRTY_MINUTES : TWO_DAYS;
export function useCurrentRecipeSession(recipe: Recipe) {
	const live = hooks.useWatch(recipe);
	let session = live.session;
	if (!session || session.get('startedAt') < Date.now() - SESSION_TIMEOUT) {
		recipe.set('session', {
			completedIngredients: [],
			completedInstructions: [],
			ingredientAssignments: {},
			instructionAssignments: {},
			startedAt: Date.now(),
		});
		session = recipe.get('session')!;
	}
	return session;
}

export function useSyncedInstructionsEditor(recipe: Recipe, readonly = false) {
	const live = hooks.useWatch(recipe);
	const instructions = live.instructions as ObjectEntity<any, any>;
	useCurrentRecipeSession(recipe);

	const updatingRef = useRef(false);

	const update = useDebouncedCallback((editor) => {
		if (updatingRef.current) return;

		const newData = editor.getJSON();
		const instructions = recipe.get('instructions');
		if (!instructions) {
			recipe.set('instructions', newData);
		} else {
			instructions.update(newData, {
				merge: false,
				replaceSubObjects: false,
			});
		}
	}, 300);

	const editor = useEditor(
		{
			extensions: createTiptapExtensions(recipe),
			content: instructions?.getSnapshot() || {
				type: 'doc',
				content: [],
			},
			editable: !readonly,
			onTransaction({ editor, transaction }) {
				if (transaction.docChanged) {
					update(editor);
				}
			},
		},
		[instructions],
	);

	useEffect(() => {
		if (editor && !editor.isDestroyed && instructions) {
			updatingRef.current = true;
			editor.commands.setContent(instructions.getSnapshot(), false);
			updatingRef.current = false;
		}

		return instructions?.subscribe('changeDeep', (target, info) => {
			if (!info.isLocal || target === instructions) {
				updatingRef.current = true;
				editor?.commands.setContent(instructions.getSnapshot(), false);
				updatingRef.current = false;
			}
		});
	}, [instructions, editor]);

	return editor;
}
