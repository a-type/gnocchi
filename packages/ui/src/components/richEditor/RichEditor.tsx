'use client';

import classNames from 'classnames';
import { forwardRef, lazy } from 'react';
import * as classes from './RichEditor.css.js';

const EditorContent = lazy(() => import('./EditorContent.js'));

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
			className={classNames(classes.root, className)}
			{...rest}
		/>
	);
});
