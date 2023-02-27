'use client';

import {
	PureEditorContent,
	EditorContent,
	EditorContentProps,
} from '@tiptap/react';
import { clsx } from 'clsx';
import { forwardRef, Ref } from 'react';
import * as classes from './RichEditor.css.js';

export interface RichEditorProps extends EditorContentProps {
	className?: string;
}

export const RichEditor = forwardRef<PureEditorContent, RichEditorProps>(
	function RichEditor({ className, ...rest }, ref) {
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
	},
);
