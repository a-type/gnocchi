import { Recipe } from '@aglio/groceries-client';
import { FontBoldIcon, FontItalicIcon } from '@radix-ui/react-icons';
import { Editor } from '@tiptap/core';
import { useSyncedInstructionsEditor } from '../hooks.js';
import * as classes from './RecipeInstructionsField.css.js';
import { Box } from '@aglio/ui/components/box';
import { P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/components/button';

export interface RecipeInstructionsFieldProps {
	recipe: Recipe;
}

export function RecipeInstructionsField({
	recipe,
}: RecipeInstructionsFieldProps) {
	const editor = useSyncedInstructionsEditor(recipe, false, isMobileOs());

	return (
		<Box gap={2} flexDirection="column">
			{/* {isMobileOs() && (
				<Box background="primaryWash" p={2} borderRadius="md">
					<P size="xs">
						Hi, mobile user! Sorry, but the instruction editor doesn't always
						work correctly on phones. I'm working on it! If you have a sync
						subscription, I recommend switching to a computer to write up your
						recipes for now.
					</P>
				</Box>
			)} */}
			{editor && <Toolbar editor={editor} />}
			<RichEditor editor={editor} className={classes.editor} />
			<P size="xs">
				Press <kbd>Enter</kbd> to create a new step. Each step line will have a
				checkbox you can use to track completion. I recommend keeping steps
				short and self-contained.
			</P>
		</Box>
	);
}

function isMobileOs() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent,
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
			style={{ top: 44, zIndex: 1 }}
			background="light"
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
				Heading
			</Button>
		</Box>
	);
}
