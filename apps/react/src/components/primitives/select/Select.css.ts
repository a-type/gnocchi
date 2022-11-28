import { vars } from '@/theme.css.js';
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
	borderColor: vars.colors.gray20,
	':hover': { borderColor: vars.colors.gray70 },
	':focus': { boxShadow: vars.shadows.focus },
	selectors: {
		'&[data-placeholder]': { color: vars.colors.gray80 },
	},
});

export const value = style({});

export const icon = style({
	color: 'inherit',
});

export const content = style({
	overflow: 'hidden',
	backgroundColor: 'white',
	borderRadius: 6,
	zIndex: vars.zIndices.menu,
	boxShadow:
		'0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
});

export const viewport = style({
	padding: vars.space[1],
});

export const item = style({
	fontSize: vars.fontSizes.md,
	lineHeight: 1,
	color: vars.colors.black,
	borderRadius: 3,
	display: 'flex',
	alignItems: 'center',
	height: 25,
	padding: '0 35px 0 25px',
	position: 'relative',
	userSelect: 'none',

	selectors: {
		'&[data-disabled]': {
			color: vars.colors.gray50,
			pointerEvents: 'none',
		},

		'&[data-highlighted]': {
			outline: 'none',
			backgroundColor: vars.colors.lemonLighter,
			color: vars.colors.lemonDarker,
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
	backgroundColor: 'white',
	color: vars.colors.lemonDark,
	cursor: 'default',
});
