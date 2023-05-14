import { Recipe } from '@aglio/groceries-client';
import { FontBoldIcon, FontItalicIcon } from '@radix-ui/react-icons';
import { Editor } from '@tiptap/core';
import { useSyncedInstructionsEditor } from '../hooks.js';
import { P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/components/button';
import { RichEditor } from '@aglio/ui/components/richEditor';

export interface RecipeInstructionsFieldProps {
	recipe: Recipe;
}

export function RecipeInstructionsField({
	recipe,
}: RecipeInstructionsFieldProps) {
	const editor = useSyncedInstructionsEditor({
		recipe,
		readonly: false,
		useBasicEditor: isMobileOs(),
	});

	return (
		<div className="flex flex-col gap-2">
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
			<RichEditor
				editor={editor}
				className="[&_.ProseMirror]:(bg-gray1 rounded-md p-4 border-default)"
			/>
			<P size="xs">
				Press <kbd>Enter</kbd> to create a new step. Each step line will have a
				checkbox you can use to track completion. I recommend keeping steps
				short and self-contained.
			</P>
		</div>
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
		<div className="flex flex-row gap-2 items-center sticky z-1 top-44px bg-light">
			<Button
				color="ghost"
				onClick={() => {
					editor.chain().focus().toggleBold().run();
				}}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				toggled={editor.isActive('bold')}
				className="[font-size:12px]"
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
				className="[font-size:12px]"
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
				className="[font-size:12px]"
			>
				Heading
			</Button>
		</div>
	);
}
