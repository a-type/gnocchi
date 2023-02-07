import { vars } from '../../theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

const slideUpAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateY(2px)' },
	'100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateX(-2px)' },
	'100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateY(-2px)' },
	'100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
	'0%': { opacity: 0, transform: 'translateX(2px)' },
	'100%': { opacity: 1, transform: 'translateX(0)' },
});

export const content = style({
	minWidth: 220,
	backgroundColor: vars.colors.white,
	zIndex: vars.zIndices.menu,
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	border: '1px solid $black',
	borderRadius: vars.radii.xl,
	padding: vars.space[5],
	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			animationDuration: '400ms',
			animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
			animationFillMode: 'forwards',
			willChange: 'transform, opacity',
			selectors: {
				'&[data-state="open"][data-side="top"]': {
					animationName: slideDownAndFade,
				},
				'&[data-state="open"][data-side="right"]': {
					animationName: slideLeftAndFade,
				},
				'&[data-state="open"][data-side="bottom"]': {
					animationName: slideUpAndFade,
				},
				'&[data-state="open"][data-side="left"]': {
					animationName: slideRightAndFade,
				},
			},
		},
	},
});

export const item = style({
	all: 'unset',
	fontSize: 13,
	lineHeight: 1,
	color: vars.colors.black,
	borderRadius: 3,
	display: 'flex',
	alignItems: 'center',
	height: 25,
	padding: '0 5px',
	position: 'relative',
	paddingLeft: vars.space[4],
	textAlign: 'left',
	userSelect: 'none',
	cursor: 'pointer',

	selectors: {
		'&[data-disabled]': {
			color: vars.colors.gray90,
			pointerEvents: 'none',
		},

		'&:focus': {
			backgroundColor: vars.colors.gray20,
			color: vars.colors.gray90,
		},
	},
});

export const label = style({
	paddingLeft: 25,
	fontSize: 12,
	lineHeight: '25px',
	color: vars.colors.gray70,
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

export const arrow = style({
	fill: 'white',
	stroke: vars.colors.black,
});

export const trigger = style({
	userSelect: 'none',
	selectors: {
		'&[data-state="open"]': {
			position: 'relative',
			zIndex: calc(vars.zIndices.menu).add(1).toString(),
		},
	},
});
