import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	backgroundColor: vars.colors.primaryWash,
	borderRadius: vars.radii.lg,
	padding: vars.space[4],
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	alignItems: 'stretch',
});

export const video = style({
	maxHeight: '60vh',
});

export const keyword = style({
	color: vars.colors.primaryDarker,
	backgroundColor: vars.colors.primaryWash,
	// display: 'inline-block',
});