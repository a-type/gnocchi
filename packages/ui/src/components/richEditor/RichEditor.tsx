'use client';

// @ts-ignore
import { EditorContent } from '@tiptap/react';
import { clsx } from 'clsx';
import { forwardRef } from 'react';
import * as classes from './RichEditor.css.js';

export interface RichEditorProps {
	editor: any;
	className?: string;
	readOnly?: boolean;
}

export const RichEditor = forwardRef<any, RichEditorProps>(function RichEditor(
	{ className, ...rest },
	ref,
) {
	if (typeof ref === 'string') {
		throw new Error('String ref not supported!');
	}
	return (
		<EditorContent
			ref={ref as any}
			className={clsx(classes.root, className)}
			{...rest}
		/>
	);
});
