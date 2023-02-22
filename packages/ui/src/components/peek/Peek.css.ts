import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../theme.css.js';

export const trigger = style({
	height: 80,
	position: 'absolute',
	bottom: 0,
	zIndex: 1,
	background: 'transparent',
	border: 'none',
	width: '100%',
	cursor: 'pointer',
	borderBottom: `1px solid ${vars.colors.white}`,
	selectors: {
		'&:focus, &:hover': {
			outline: 'none',
			background:
				'linear-gradient(rgba(255, 255, 255, 0), rgba(249, 231, 148, 0.7))',
			borderBottom: `1px solid ${vars.colors.primary}`,
		},
		'&::after': {
			content: '"- tap to expand -"',
			padding: vars.space[3],
			color: vars.colors.gray90,
			fontSize: vars.fontSizes.xs,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			height: 80,
			background:
				'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
		},
		'&[data-state="open"]::after': {
			content: '"- tap to collapse -"',
		},
	},
});

const open = keyframes({
	from: { height: 'min(var(--peek-height, 120px), var(--collapsible-height))' },
	to: { height: 'calc(var(--collapsible-height) + 80px)' },
});

const close = keyframes({
	from: { height: 'calc(var(--collapsible-height) + 80px)', maxHeight: 'none' },
	to: {
		height: 'min(var(--peek-height, 120px), var(--collapsible-height))',
		maxHeight: 'var(--peek-height, 120px)',
	},
});

export const content = style({});

export const root = style({
	position: 'relative',
	animationTimingFunction: vars.transitions.default,
	animationFillMode: 'forwards',
	overflow: 'hidden',

	selectors: {
		'&[data-state=closed]': {
			animationName: close,
			animationDuration: '300ms',
			maxHeight: 'var(--peek-height, 120px)',
		},
		'&[data-state=open]': {
			animationName: open,
			animationDuration: '300ms',
		},
	},
});
