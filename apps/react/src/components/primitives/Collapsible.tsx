import { keyframes, styled } from '@/stitches.config.js';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

export const CollapsibleRoot = styled(CollapsiblePrimitive.Root, {});
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const open = keyframes({
	from: { height: 0 },
	to: { height: 'var(--radix-collapsible-content-height)' },
});
const close = keyframes({
	from: { height: 'var(--radix-collapsible-content-height)' },
	to: { height: 0 },
});

export const CollapsibleContent = styled(CollapsiblePrimitive.Content, {
	overflow: 'hidden',
	'&[data-state=open]': {
		animation: `${open} 300ms $transitions$springy`,
	},
	'&[data-state=closed]': {
		animation: `${close} 300ms $transitions$springy`,
	},
});
