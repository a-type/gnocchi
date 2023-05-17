import { Peek } from '@aglio/ui/components/peek';
import { RichEditor } from '@aglio/ui/components/richEditor';
import { HubPublishedRecipeInfo } from '@aglio/trpc';
// @ts-ignore
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';

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
			<div className={classNames('p-summary', 'pb-4')} itemProp="description">
				<RichEditor editor={editor} readOnly />
			</div>
		</Peek>
	);
}
