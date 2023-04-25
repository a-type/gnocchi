import { style } from '@vanilla-extract/css';
import { vars } from '../../styles.js';

export const content = style({
	minWidth: 220,
	backgroundColor: vars.colors.white,
	borderRadius: vars.radii.md,
	border: `1px solid ${vars.colors.black}`,
	overflow: 'hidden',
	padding: vars.space[2],
	boxShadow: vars.shadows.md,
	zIndex: vars.zIndices.menu,
});

export const arrow = style({
	fill: vars.colors.white,
});

export const item = style({
	display: 'flex',
	alignItems: 'center',
	padding: `${vars.space[1]} ${vars.space[2]}`,
	position: 'relative',
	paddingLeft: 25,
	userSelect: 'none',
	outline: 'none',
	cursor: 'pointer',

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
		},
		'&[data-highlighted="true"]': {
			backgroundColor: vars.colors.gray20,
		},
		'&[data-disabled="true"], &:disabled': {
			opacity: 0.5,
			cursor: 'default',
		},
	},
});

export const trigger = style({});
