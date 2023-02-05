import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const form = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space[2],
	flexDirection: 'row',
	maxWidth: '100%',
});

export const input = style({
	flex: '1 1 0',
	minWidth: 60,
	maxWidth: '40vw',
});
