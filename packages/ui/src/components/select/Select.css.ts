import { calc } from '@vanilla-extract/css-utils';
import { vars } from '../../styles/theme.css.js';
import { style } from '@vanilla-extract/css';

export const trigger = style({
	all: 'unset',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: vars.radii.md,
	paddingLeft: vars.space[2],
	paddingRight: vars.space[2],
	paddingTop: vars.space[1],
	paddingBottom: vars.space[1],
	fontSize: vars.fontSizes.sm,
	lineHeight: 1,
	gap: vars.space[1],
	color: vars.colors.black,
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: vars.colors.gray50,
	':hover': { borderColor: vars.colors.gray70 },
	':focus': { boxShadow: vars.shadows.focus },
	selectors: {
		'&[data-placeholder]': { color: vars.colors.gray80 },
	},
});

export const value = style({
	display: 'flex',
	flexDirection: 'row',
});

export const icon = style({
	color: 'inherit',
});

export const content = style({
	overflow: 'hidden',
	backgroundColor: vars.colors.white,
	borderRadius: 6,
	zIndex: vars.zIndices.menu,
	boxShadow: vars.shadows.lg,
});

export const contentInDialog = style({
	zIndex: calc(vars.zIndices.dialog).add(1).toString(),
});

export const viewport = style({
	padding: vars.space[1],
});

export const item = style({
	fontSize: vars.fontSizes.md,
	lineHeight: 1,
	color: vars.colors.black,
	borderRadius: vars.radii.sm,
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'row',
	height: 36,
	padding: `0 ${vars.space[4]} 0 35px`,
	position: 'relative',
	userSelect: 'none',

	selectors: {
		'&[data-disabled]': {
			color: vars.colors.gray50,
			pointerEvents: 'none',
		},

		'&[data-highlighted]': {
			outline: 'none',
			backgroundColor: vars.colors.primaryLighter,
			color: vars.colors.primaryDarker,
		},
	},
});

export const itemText = style({});

export const label = style({
	padding: '0 25px',
	fontSize: vars.fontSizes.xs,
	lineHeight: 1.5,
	color: vars.colors.black,
});

export const separator = style({
	height: 1,
	backgroundColor: vars.colors.gray50,
	margin: 5,
});

export const itemIndicator = style({
	position: 'absolute',
	left: 0,
	width: 25,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const scrollButton = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: 25,
	backgroundColor: vars.colors.white,
	color: vars.colors.primaryDark,
	cursor: 'default',
});
