import { Box, Button } from '@/components/primitives/index.js';
import { RichEditor } from '@/components/primitives/richEditor/RichEditor.jsx';
import { Recipe } from '@aglio/groceries-client';
import { FontBoldIcon, FontItalicIcon } from '@radix-ui/react-icons';
import { Editor } from '@tiptap/core';
import { useSyncedInstructionsEditor } from '../hooks.js';
import * as classes from './RecipeInstructionsField.css.js';

export interface RecipeInstructionsFieldProps {
	recipe: Recipe;
}

export function RecipeInstructionsField({
	recipe,
}: RecipeInstructionsFieldProps) {
	const editor = useSyncedInstructionsEditor(recipe);

	return (
		<Box gap={2} flexDirection="column">
			{editor && <Toolbar editor={editor} />}
			<RichEditor editor={editor} className={classes.editor} />
		</Box>
	);
}

function Toolbar({ editor }: { editor: Editor }) {
	return (
		// Sticks below the action bar
		<Box
			flexDirection="row"
			gap={2}
			align="center"
			position="sticky"
			zIndex="menu"
			style={{ top: 72 }}
			background="white"
		>
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
					editor.chain().focus().toggleSectionTitle().run();
				}}
				disabled={!editor.can().chain().focus().toggleSectionTitle().run()}
				toggled={editor.isActive('sectionTitle')}
				className={classes.controlButton}
			>
				H
			</Button>
			{/* <Button
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
			</Button> */}
		</Box>
	);
}
