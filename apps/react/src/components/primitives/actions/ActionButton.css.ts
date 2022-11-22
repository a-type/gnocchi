import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	borderColor: vars.colors.gray70,
	fontWeight: 'normal',
	whiteSpace: 'nowrap',

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
		},
	},
});
