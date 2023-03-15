'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { withClassName } from '../../withClassName.jsx';
import * as classes from './Dialog.css.js';

const StyledOverlay = withClassName(DialogPrimitive.Overlay, classes.overlay);

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
	return (
		<DialogPrimitive.Portal>
			<StyledOverlay />
			<StyledContent width={width} className={outerClassName}>
				<StyledContentContent ref={ref} {...props}>
					{children}
				</StyledContentContent>
			</StyledContent>
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
