'use client';

import classNames from 'classnames';
import { forwardRef, lazy } from 'react';

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
			className={classNames(
				'layer-components:(w-full rounded-lg)',
				!rest.readOnly &&
					'bg-gray-blend [&_.ProseMirror:focus]:(outline-none bg-gray-1 shadow-focus)',
				'[&_.ProseMirror_h1,h2,h3,p]:mt-0',
				'[&_.ProseMirror_h1]:(text-xl font-medium)',
				'[&_.ProseMirror_h2]:(text-lg font-medium mt-4 mb-2)',
				'[&_.ProseMirror_h3]:(text-md font-extrabold)',
				'[&_.ProseMirror_a]:underline',
				className,
			)}
			{...rest}
		/>
	);
});
