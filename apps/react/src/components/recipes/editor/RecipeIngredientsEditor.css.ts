import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const listContainer = style({
	border: `1px solid ${vars.colors.gray50}`,
	borderRadius: vars.radii.lg,
	padding: vars.space[2],
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'start',
	padding: vars.space[2],
});

export const itemText = style({
	flex: 1,
	minWidth: 40,
});

export const dragHandle = style({
	touchAction: 'none',
	position: 'relative',
	top: 4,
});
