import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const list = style({
	listStyle: 'none',
	margin: 0,
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	padding: 0,
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
});

export const itemChecked = style({});
