import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const popoverContainer = style({
	width: '100%',
});

export const button = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space[2],
});
