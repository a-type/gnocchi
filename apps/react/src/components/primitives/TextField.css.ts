import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const label = style({
	fontSize: vars.fontSizes.sm,
	fontWeight: 'bold',
});
