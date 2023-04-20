import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
});

export const controls = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
});

export const video = style({
	width: '100%',
	height: '100%',
});

export const cropContainer = style({
	width: '100%',
	flex: 1,
	position: 'relative',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	justifyContent: 'center',
	backgroundColor: 'black',
});

const fadeIn = keyframes({
	'0%': {
		opacity: 0,
	},
	'100%': {
		opacity: 1,
	},
});
export const imagePreview = style({
	position: 'absolute',
	zIndex: 1,
	width: '100%',
	height: '100%',
	objectFit: 'contain',
	backgroundColor: 'black',

	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			animationName: fadeIn,
			animationDuration: '0.5s',
			animationTimingFunction: 'ease-in-out',
		},
	},
});

const scanLineMove = keyframes({
	'0%': {
		top: '0%',
	},
	'30%': {
		top: '100%',
	},
	'70%': {
		top: '100%',
	},
	'100%': {
		top: '0%',
	},
});

export const scanLine = style({
	position: 'absolute',
	zIndex: 2,
	width: '100%',
	height: '2px',
	backgroundColor: 'rgba(255, 255, 255, 0.8)',

	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			animationName: scanLineMove,
			animationDuration: '2s',
			animationTimingFunction: 'linear',
			animationIterationCount: 'infinite',
			animationDelay: '0.5s',
		},
	},
});
