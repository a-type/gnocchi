import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css.js';

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

export const content = style({
	overflow: 'hidden',
	animationTimingFunction: vars.transitions.springy,
	selectors: {
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
	},
});
