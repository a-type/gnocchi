import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const form = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space[2],
	flexDirection: 'row',
});

export const input = style({
	flex: 1,
});
