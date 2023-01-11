import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	borderColor: vars.colors.gray70,
	fontWeight: 'normal !important',
	whiteSpace: 'nowrap',

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
		},
	},
});

export const outer = style({
	overflow: 'hidden',
});
