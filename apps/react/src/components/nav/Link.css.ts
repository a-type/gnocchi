import { style } from '@vanilla-extract/css';

export const root = style({
	selectors: {
		'&[data-transitioning="true"]': {
			opacity: 0.7,
		},
	},
});
