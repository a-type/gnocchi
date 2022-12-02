import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	border: `6px solid ${vars.colors.black}`,
	borderRadius: vars.radii.lg,
});

export const image = style({
	width: '100%',
	height: 'auto',
	borderRadius: vars.radii.lg,
});
