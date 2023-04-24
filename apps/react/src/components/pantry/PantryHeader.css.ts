import { style } from '@vanilla-extract/css';

export const plusIcon = style({
	transition: 'transform 0.2s ease-in-out',
	selectors: {
		'[data-state="open"] &': {
			transform: 'rotate(45deg)',
		},
	},
});
