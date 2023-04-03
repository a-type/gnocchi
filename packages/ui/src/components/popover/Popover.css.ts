import { vars } from '../../styles/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { recipe } from '@vanilla-extract/recipes';

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

export const content = recipe({
	base: {
		borderRadius: vars.radii.xl,
		padding: vars.space[5],
		minWidth: 120,
		backgroundColor: vars.colors.white,
		zIndex: vars.zIndices.menu,
		boxShadow: vars.shadows.lg,
		border: `1px solid ${vars.colors.black}`,
		opacity: 0,
		display: 'none',
		maxWidth: '90vw',
		'@media': {
			'(prefers-reduced-motion: no-preference)': {
				animationDuration: '400ms',
				animationTimingFunction: vars.transitions.springy,
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

		selectors: {
			'&[data-state="open"]': {
				opacity: 1,
				display: 'flex',
				flexDirection: 'column',
			},
			'&:focus': {
				// boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $colors$lemon`,
			},
		},
	},

	variants: {
		padding: {
			none: { padding: 0 },
			default: { padding: vars.space[5] },
		},
		radius: {
			none: { borderRadius: 0 },
			default: { borderRadius: vars.radii.xl },
			md: { borderRadius: vars.radii.md },
		},
	},
});

export const arrow = style({
	fill: 'white',
	stroke: vars.colors.black,
});

export const close = style({
	all: 'unset',
	fontFamily: 'inherit',
	borderRadius: '100%',
	height: 25,
	width: 25,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: vars.colors.darkBlend,
	position: 'absolute',
	top: 5,
	right: 5,

	selectors: {
		'&:hover': { backgroundColor: vars.colors.lightBlend },
		'&:focus': { boxShadow: `0 0 0 2px ${vars.colors.primary}` },
	},
});

export const trigger = style({
	selectors: {
		'&[data-state="open"]': {
			position: 'relative',
			zIndex: calc(vars.zIndices.menu).add(1).toString(),
		},
	},
});

export const anchor = style({
	selectors: {
		'&[data-state="open"]': {
			position: 'relative',
			zIndex: calc(vars.zIndices.menu).add(1).toString(),
		},
	},
});
