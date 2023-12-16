'use client';

import { Peek } from '@a-type/ui/components/peek';
import { RichEditor } from '@a-type/ui/components/richEditor';
import { HubPublishedRecipeInfo } from '@aglio/trpc';
// @ts-ignore
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import Link from '@tiptap/extension-link';

export interface PreludeProps {
	content: Exclude<HubPublishedRecipeInfo['prelude'], null>;
}

export function Prelude({ content }: PreludeProps) {
	const editor = useEditor({
		extensions: [StarterKit.configure({}), Link],
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
