import { ObjectEntity, Recipe } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import { useEditor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { createTiptapExtensions } from './editor/tiptapExtensions.js';

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
	const session = useCurrentRecipeSession(recipe);

	const updatingRef = useRef(false);

	const editor = useEditor(
		{
			extensions: createTiptapExtensions(session),
			content: instructions?.getSnapshot() || {
				type: 'doc',
				content: [],
			},
			editable: !readonly,
			onUpdate({ editor }) {
				if (!updatingRef.current) {
					const newData = editor.getJSON();
					if (!instructions) {
						recipe.set('instructions', newData);
					} else {
						instructions.update(newData, {
							merge: false,
						});
					}
				}
			},
		},
		[instructions],
	);

	useEffect(() => {
		if (editor && !editor.isDestroyed && instructions) {
			updatingRef.current = true;
			editor.commands.setContent(instructions.getSnapshot());
			updatingRef.current = false;
		}

		return instructions?.subscribe('changeDeep', (target, info) => {
			if (!info.isLocal || target === instructions) {
				updatingRef.current = true;
				editor?.commands.setContent(instructions.getSnapshot());
				updatingRef.current = false;
			}
		});
	}, [instructions, editor]);

	return editor;
}
