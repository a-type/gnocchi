import { vars } from '@aglio/ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const popIn = keyframes({
	'0%': {
		opacity: 0,
		transform: 'translateY(20px)',
	},
	'100%': {
		opacity: 1,
		transform: 'translateY(0px)',
	},
});

const collapse = keyframes({
	'0%': {
		height: 'var(--height)',
		opacity: 1,
	},
	'100%': {
		height: 0,
		opacity: 0,
	},
});

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	borderRadius: vars.radii.md,
	backgroundColor: vars.colors.light,
	overflow: 'hidden',
	transition: `box-shadow 0.2s ${vars.transitions.springy}, transform 0.2s ${vars.transitions.springy}, background-color 0.5s linear`,
	marginBottom: vars.space[4],

	selectors: {
		'&[data-dragged-over="true"]': {
			backgroundColor: vars.colors.primaryWash,
			borderColor: vars.colors.primaryDark,
		},
		'&[data-is-item-dragging="true"]': {
			boxShadow: `0 0 0 1px ${vars.colors.gray30}`,
		},
		'&[data-is-empty="true"]:not([data-is-item-dragging="true"])': {
			height: 0,
			opacity: 0,
			pointerEvents: 'none',
			marginBottom: 0,
			animation: `${collapse} 0.2s ${vars.transitions.default} forwards`,
			visibility: 'hidden',
		},
		'&[data-do-not-animate="true"]': {
			animation: 'none!important',
		},
		'&[data-is-item-dragging="true"][data-dragged-over="false"]': {
			transform: 'scale(0.95)',
		},
		'&[data-is-empty="false"][data-dragged-over="false"][data-is-item-dragging="false"]':
			{
				animationName: popIn,
				animationDuration: '0.2s',
				animationTimingFunction: vars.transitions.springy,
			},

		'&:focus-visible': {
			color: vars.colors.primaryDark,
			outline: `1px solid ${vars.colors.primaryWash}`,
		},
	},
});
