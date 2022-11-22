import { keyframes, styled } from '@/stitches.config.js';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

export const CollapsibleRoot = styled(CollapsiblePrimitive.Root, {});
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const openVertical = keyframes({
	from: { height: 0 },
	to: { height: 'var(--radix-collapsible-content-height)' },
});
const closeVertical = keyframes({
	from: { height: 'var(--radix-collapsible-content-height)' },
	to: { height: 0 },
});
const openHorizontal = keyframes({
	from: { width: 0 },
	to: { width: 'var(--radix-collapsible-content-width)' },
});
const closeHorizontal = keyframes({
	from: { width: 'var(--radix-collapsible-content-width)' },
	to: { width: 0 },
});

export const CollapsibleContent = styled(CollapsiblePrimitive.Content, {
	overflow: 'hidden',
	animationTimingFunction: '$transitions$springy',
	'&[data-state=open]': {
		animationName: openVertical,
		animationDuration: '300ms',
	},
	'&[data-state=closed]': {
		animationName: closeVertical,
		animationDuration: '300ms',
	},
	'&[data-state=open][data-horizontal]': {
		animationName: openHorizontal,
	},
	'&[data-state=closed][data-horizontal]': {
		animationName: closeHorizontal,
	},
});
