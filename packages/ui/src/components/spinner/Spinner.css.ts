import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
	'0%': {
		transformOrigin: '50% 50%',
	},
	'100%': {
		transform: 'rotate(360deg)',
	},
});

const oscillate = keyframes({
	'0%': {
		strokeDasharray: '1px, 200px',
		strokeDashoffset: '0px',
	},
	'50%': {
		strokeDasharray: '100px, 200px',
		strokeDashoffset: '-15px',
	},
	'100%': {
		strokeDasharray: '100px, 200px',
		strokeDashoffset: '-125px',
	},
});

export const root = style({
	display: 'inline-block',
	animation: `${spin} 1.4s linear infinite`,
	color: 'inherit',
});

export const svg = style({
	display: 'block',
});

export const circle = style({
	stroke: 'currentColor',
	animation: `${oscillate} 1.4s ease-in-out infinite`,
	strokeDasharray: '80px, 200px',
	strokeDashoffset: '0px',
});
