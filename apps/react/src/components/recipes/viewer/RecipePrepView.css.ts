import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[3],
});

export const action = style({
	display: 'flex',
	flexDirection: 'column',
});

export const list = style({});