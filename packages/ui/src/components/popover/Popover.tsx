'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { withClassName } from '../../withClassName.jsx';
import * as classes from './Popover.css.js';

const StyledContent = withClassName(PopoverPrimitive.Content, classes.content);

const StyledArrow = withClassName(PopoverPrimitive.Arrow, classes.arrow);

const StyledClose = withClassName(PopoverPrimitive.Close, classes.close);

// Exports
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = withClassName(
	PopoverPrimitive.Trigger,
	classes.trigger,
);
export const PopoverArrow = StyledArrow;
export const PopoverClose = StyledClose;
export const PopoverAnchor = withClassName(
	PopoverPrimitive.Anchor,
	classes.anchor,
);

export const PopoverContent = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof StyledContent> & {
		disableBlur?: boolean;
		containerClassName?: string;
	}
>(function PopoverContent(
	{ children, forceMount, disableBlur, containerClassName, ...props },
	ref,
) {
	return (
		<PopoverPrimitive.Portal
			forceMount={forceMount}
			className={containerClassName}
		>
			<StyledContent {...props} forceMount={forceMount} ref={ref}>
				{children}
			</StyledContent>
		</PopoverPrimitive.Portal>
	);
});
