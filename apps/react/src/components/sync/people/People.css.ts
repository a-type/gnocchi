import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
});
