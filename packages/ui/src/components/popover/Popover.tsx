'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';

import { withClassName } from '../../withClassName.jsx';
import useMergedRef from '../../hooks/useMergedRef.js';
import { createPortal } from 'react-dom';
import { BlurLayer } from '../blurLayer/BlurLayer.js';
import * as classes from './Popover.css.js';

const StyledContent = withClassName(PopoverPrimitive.Content, classes.content, [
	'padding',
	'radius',
]);

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
	const [contentElement, contentRef] = useState<HTMLDivElement | null>(null);
	const mergedRef = useMergedRef(ref, contentRef);
	return (
		<PopoverPrimitive.Portal
			forceMount={forceMount}
			className={containerClassName}
		>
			<>
				<StyledContent {...props} forceMount={forceMount} ref={mergedRef}>
					{children}
				</StyledContent>
				{!disableBlur &&
					contentElement &&
					createPortal(<BlurLayer />, contentElement.parentElement!)}
			</>
		</PopoverPrimitive.Portal>
	);
});
