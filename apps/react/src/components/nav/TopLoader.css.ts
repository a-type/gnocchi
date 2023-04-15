import { mediaQueries, vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '4px',
	pointerEvents: 'none',
	opacity: 0,

	selectors: {
		'&[data-state="visible"]': {
			opacity: 1,
			transition: 'opacity 0.3s ease-in-out',
		},
	},

	'@media': {
		[mediaQueries.md]: {
			height: '2px',
		},

		'(prefers-reduced-motion: reduce)': {
			display: 'none',
		},
	},
});

export const bar = style({
	position: 'absolute',
	top: 0,
	left: 0,
	height: '100%',
	backgroundColor: vars.colors.accent,
});
