import { H4, H2, H3, P, Peek, RichEditor } from '@aglio/ui';
import { HubPublishedRecipeInfo } from '@aglio/trpc';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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
			<div className="p-summary" itemProp="description">
				<RichEditor editor={editor} readOnly />
			</div>
		</Peek>
	);
}
