'use client';

import React, {
	ComponentPropsWithoutRef,
	forwardRef,
	ReactNode,
	useState,
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { BlurLayer } from '../blurLayer/BlurLayer.js';
import { withClassName } from '../../withClassName.jsx';
import * as classes from './Dialog.css.js';
import { createPortal } from 'react-dom';
import useMergedRef from '../../hooks/useMergedRef.js';

const StyledOverlay = withClassName(DialogPrimitive.Overlay, classes.overlay);

const StyledBlurLayer = withClassName(BlurLayer, classes.blurLayer);

const StyledContent = withClassName('div', classes.content, ['width']);

const StyledContentContent = withClassName(
	DialogPrimitive.Content,
	classes.contentContent,
);

export const Content = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof StyledContentContent> & {
		outerClassName?: string;
		disableBlur?: boolean;
		width?: ComponentPropsWithoutRef<typeof StyledContent>['width'];
	}
>(function Content(
	{ children, width, outerClassName, disableBlur, ...props },
	ref,
) {
	const [contentElement, contentRef] = useState<HTMLDivElement | null>(null);
	const mergedRef = useMergedRef(ref, contentRef);

	return (
		<DialogPrimitive.Portal>
			<StyledOverlay />
			<>
				<StyledContent width={width} className={outerClassName}>
					<StyledContentContent ref={mergedRef} {...props}>
						{children}
					</StyledContentContent>
					<StyledBlurLayer />
				</StyledContent>
				{!disableBlur &&
					contentElement &&
					createPortal(<BlurLayer />, contentElement.parentElement!)}
			</>
		</DialogPrimitive.Portal>
	);
});

const StyledTitle = withClassName(DialogPrimitive.Title, classes.title);

const StyledDescription = withClassName(
	DialogPrimitive.Description,
	classes.description,
);

// Exports
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = Content;
export const DialogTitle = StyledTitle;
export const DialogDescription = StyledDescription;
export const DialogClose = DialogPrimitive.Close;

export const DialogActions = withClassName('div', classes.actions);
