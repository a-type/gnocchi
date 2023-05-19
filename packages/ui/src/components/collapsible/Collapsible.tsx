'use client';

import { forwardRef } from 'react';
import { withClassName } from '../../hooks/withClassName.js';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

export const CollapsibleRoot = CollapsiblePrimitive.Root;
const CollapsibleContentBase = withClassName(
	CollapsiblePrimitive.Content,
	'overflow-hidden animate-forwards',
	'[&[data-state=open]]:(animate-radix-collapsible-open-vertical animate-duration-300 animate-ease-springy) [&[data-state=closed]]:(animate-radix-collapsible-close-vertical animate-duration-300 animate-ease-springy)',
	'[&[data-horizontal][data-state=open]]:(animate-radix-collapsible-open-horizontal animate-duration-300 animate-ease-springy) [&[data-horizontal][data-state=closed]]:(animate-radix-collapsible-close-horizontal animate-duration-300 animate-ease-springy)',
);
// specifically removing className... it's causing problems?
export const CollapsibleContent = forwardRef<
	HTMLDivElement,
	CollapsiblePrimitive.CollapsibleContentProps & {
		horizontal?: boolean;
	}
>(function CollapsibleContent({ horizontal, ...props }, ref) {
	return (
		<CollapsibleContentBase data-horizontal={horizontal} {...props} ref={ref} />
	);
});
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
