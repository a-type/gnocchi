import { vars } from '@/theme.css.js';
import { style, keyframes } from '@vanilla-extract/css';

const popIn = keyframes({
	'0%': { opacity: 0, transform: 'scale(0.5) translate(-50%, -50%)' },
	'100%': { opacity: 1, transform: 'scale(1) translate(-50%, -50%)' },
});

export const trigger = style({
	position: 'relative',
	padding: vars.space[1],
	borderRadius: vars.radii.md,
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
	':hover': {
		backgroundColor: vars.colors.gray30,
	},
});
export const meetupHint = style({
	position: 'absolute',
	top: 5,
	left: 5,
	transform: 'translate(-50%, -50%)',
	animationName: popIn,
	animationDuration: '0.2s',
	animationTimingFunction: vars.transitions.springy,
});
