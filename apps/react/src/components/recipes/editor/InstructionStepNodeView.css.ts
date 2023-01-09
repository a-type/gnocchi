import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[4],
	marginBottom: vars.space[5],
});

export const completed = style({
	opacity: 0.7,
});
