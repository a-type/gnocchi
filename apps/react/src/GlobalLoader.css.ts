import { keyframes, style } from '@vanilla-extract/css';

export const wrapper = style({
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	width: '100%',
	height: '100%',
});

export const fullSize = style({
	width: '100%',
	height: '100%',
	display: 'flex',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'center',
	flex: 1,
});

const fadeAndPop = keyframes({
	'0%': {
		opacity: 0.2,
		transform: 'scale(0.6)',
	},
	'40%': {
		opacity: 0.5,
		transform: 'scale(0.7)',
	},
	'50%': {
		opacity: 1,
		transform: 'scale(1.1) rotate(2deg)',
	},
	'55%': {
		opacity: 1,
		transform: 'scale(1)',
	},
	'70%': {
		opacity: 1,
		transform: 'scale(1)',
	},
	'100%': {
		opacity: 0.2,
		transform: 'scale(0.6)',
	},
});

export const loaderIcon = style({
	opacity: 0,
	width: '20vmax',
	height: '20vmax',
	margin: 'auto',

	animationName: fadeAndPop,
	animationDuration: '5s',
	animationIterationCount: 'infinite',
	animationTimingFunction: 'ease-in-out',
	animationDelay: '1000ms',
});
