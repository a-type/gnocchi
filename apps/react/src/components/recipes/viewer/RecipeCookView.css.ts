import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(32px)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0)',
	},
});

export const container = style({
	animation: `${fadeUp} 0.3s ease-out`,
});