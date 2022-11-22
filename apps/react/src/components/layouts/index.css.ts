import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const fixedArea = style({
	position: 'sticky',
	top: 0,
	zIndex: 1,
	backgroundColor: vars.colors.light,
	width: '100%',
	padding: vars.space[4],
	alignItems: 'stretch',
	gap: vars.space[2],
});
