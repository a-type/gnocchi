import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	borderColor: vars.colors.gray70,
	fontWeight: 'normal !important',
	whiteSpace: 'nowrap',
	margin: 8,
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'center',

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
		},
	},
});

export const outer = style({
	overflow: 'hidden',
});
