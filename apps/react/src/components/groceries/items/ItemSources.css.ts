import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	marginRight: 'auto',
	marginTop: vars.space[2],
	marginLeft: vars.space[2],
	listStyle: 'none',
	padding: 0,
	marginBottom: 0,
	fontSize: vars.fontSizes.xs,
	color: vars.colors.gray70,
});

export const item = style({
	color: 'inherit',
	fontSize: 'inherit',
	display: 'inline',

	selectors: {
		'&:not(:last-child)::after': {
			content: '", "',
		},
	},
});
