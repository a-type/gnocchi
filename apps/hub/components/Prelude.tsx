import { Peek } from '@aglio/ui/components/peek';
import { RichEditor } from '@aglio/ui/components/richEditor';
import { HubPublishedRecipeInfo } from '@aglio/trpc';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import * as classes from './Prelude.css.js';

export interface PreludeProps {
	content: Exclude<HubPublishedRecipeInfo['prelude'], null>;
}

export function Prelude({ content }: PreludeProps) {
	const editor = useEditor({
		extensions: [StarterKit.configure({})],
		content,
		editable: false,
	});
	return (
		<Peek peekHeight={400}>
			<div
				className={classNames('p-summary', classes.container)}
				itemProp="description"
			>
				<RichEditor editor={editor} readOnly />
			</div>
		</Peek>
	);
}
