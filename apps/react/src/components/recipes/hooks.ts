import { ObjectEntity, Recipe } from '@/stores/recipes/client/index.js';
import { hooks } from '@/stores/recipes/index.js';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import { tiptapExtensions } from './editor/tiptapExtensions.js';

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

export function useSyncedInstructionsEditor(recipe: Recipe, readonly = false) {
	const live = hooks.useWatch(recipe);
	const instructions = live?.instructions as ObjectEntity<any, any>;

	const updatingRef = useRef(false);

	const editor = useEditor(
		{
			extensions: tiptapExtensions,
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
			if (!info.isLocal) {
				updatingRef.current = true;
				editor?.commands.setContent(instructions.getSnapshot());
				updatingRef.current = false;
			}
		});
	}, [instructions, editor]);

	return editor;
}
