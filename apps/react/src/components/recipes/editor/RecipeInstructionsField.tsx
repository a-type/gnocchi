import { hooks, Recipe } from '@/stores/recipes/index.js';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ObjectEntity } from '@lo-fi/web';
import { Editor } from '@tiptap/core';
import { Box, Button } from '@/components/primitives/index.js';
import {
	FontBoldIcon,
	FontItalicIcon,
	ListBulletIcon,
} from '@radix-ui/react-icons';
import * as classes from './RecipeInstructionsField.css.js';

export interface RecipeInstructionsFieldProps {
	recipe: Recipe;
}

export function RecipeInstructionsField({
	recipe,
}: RecipeInstructionsFieldProps) {
	const live = hooks.useWatch(recipe);
	const instructions = live?.instructions as ObjectEntity<any, any>;

	const updatingRef = useRef(false);

	const editor = useEditor(
		{
			extensions: [StarterKit as any],
			content: instructions?.getSnapshot(),
			onUpdate({ editor }) {
				if (!updatingRef.current) {
					const newData = editor.getJSON();
					if (!instructions) {
						recipe.set('instructions', newData);
					} else {
						instructions.update(newData);
					}
				}
			},
		},
		[instructions],
	);

	useEffect(() => {
		return instructions?.subscribe('changeDeep', (target, info) => {
			if (!info.isLocal) {
				updatingRef.current = true;
				editor?.commands.setContent(instructions.getSnapshot());
				updatingRef.current = false;
			}
		});
	}, [instructions, editor]);

	return (
		<Box gap={2} flexDirection="column">
			{editor && <Toolbar editor={editor} />}
			<EditorContent editor={editor} className={classes.editor} />
		</Box>
	);
}

function Toolbar({ editor }: { editor: Editor }) {
	return (
		<Box flexDirection="row" gap={2} align="center">
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleBold().run();
				}}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				toggled={editor.isActive('bold')}
				className={classes.controlButton}
			>
				<FontBoldIcon />
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleItalic().run();
				}}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				toggled={editor.isActive('italic')}
				className={classes.controlButton}
			>
				<FontItalicIcon />
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleHeading({ level: 1 }).run();
				}}
				toggled={editor.isActive('heading', { level: 1 })}
				className={classes.controlButton}
			>
				H1
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleHeading({ level: 2 }).run();
				}}
				toggled={editor.isActive('heading', { level: 2 })}
				className={classes.controlButton}
			>
				H2
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleHeading({ level: 3 }).run();
				}}
				toggled={editor.isActive('heading', { level: 3 })}
				className={classes.controlButton}
			>
				H3
			</Button>
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleBulletList().run();
				}}
				toggled={editor.isActive('bulletList')}
				className={classes.controlButton}
			>
				<ListBulletIcon />
			</Button>
		</Box>
	);
}
