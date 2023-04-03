import { vars } from '@aglio/ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

// inflates the outer circle, then disappears
const popOuter = keyframes({
	'0%': {
		transform: 'translate(-50%, -50%) scale(0)',
		opacity: 1,
	},
	'25%': {
		transform: 'translate(-50%, -50%) scale(1)',
		opacity: 1,
	},
	'100%': {
		transform: 'translate(-50%, -50%) scale(1)',
		opacity: 0,
	},
});

export const root = style({
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%) scale(0)',
	backgroundColor: vars.colors.primary,
	borderRadius: '50%',
	width: 50,
	height: 50,
	overflow: 'hidden',
	zIndex: -1,

	selectors: {
		'&[data-active="true"]': {
			animationName: popOuter,
			animationDuration: '1.5s',
			animationTimingFunction: 'ease-out',
			animationIterationCount: '1',
		},
	},
});

export const inner = style({
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%) scale(0)',
	width: 48,
	height: 48,
	backgroundColor: vars.colors.white,
	borderRadius: '50%',
	zIndex: 0,

	selectors: {
		'&[data-active="true"]': {
			animationName: popOuter,
			animationDuration: '1s',
			animationTimingFunction: 'ease-out',
			animationDelay: '0.5s',
			animationIterationCount: '1',
		},
	},
});
