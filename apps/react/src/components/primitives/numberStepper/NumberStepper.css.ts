import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const container = style({
	display: 'flex',
	alignItems: 'center',
	border: `1px solid ${vars.colors.black}`,
	borderRadius: vars.radii.lg,
	overflow: 'hidden',
	width: 'auto',
});

export const button = style({});

export const display = style({
	width: 80,
	textAlign: 'center',
});

export const highlightChange = style({
	backgroundColor: vars.colors.accentLight,
});
