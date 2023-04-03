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

export const content = style({
	minWidth: 220,
	backgroundColor: vars.colors.white,
	zIndex: vars.zIndices.menu,
	boxShadow: vars.shadows.lg,
	borderRadius: vars.radii.lg,
	padding: vars.space[2],
	border: `1px solid ${vars.colors.black}`,

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

export const item = recipe({
	base: {
		all: 'unset',
		fontSize: vars.fontSizes.md,
		lineHeight: 1,
		color: vars.colors.black,
		borderRadius: vars.radii.sm,
		display: 'flex',
		alignItems: 'center',
		height: 36,
		padding: '0 5px',
		position: 'relative',
		paddingLeft: vars.space[6],
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
	},
	variants: {
		color: {
			default: {},
			destructive: {
				color: vars.colors.attentionDark,

				selectors: {
					'&:focus': {
						backgroundColor: vars.colors.attentionLight,
						color: vars.colors.black,
					},
				},
			},
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

export const rightSlot = style({
	marginLeft: 'auto',
});
