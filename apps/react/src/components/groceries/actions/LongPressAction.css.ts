import { vars } from '@aglio/ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

export const popoverContent = style({
	position: 'relative',
	overflow: 'hidden',
	padding: `${vars.space[2]} ${vars.space[4]}`,
	fontSize: vars.fontSizes.sm,
});

const progressMove = keyframes({
	'0%': {
		width: '0%',
	},
	'100%': {
		width: '100%',
	},
});

export const progress = style({
	position: 'absolute',
	top: 0,
	left: 0,
	height: '100%',
});

export const progressing = style({
	animationName: progressMove,
	animationTimingFunction: 'linear',
	animationFillMode: 'forwards',
});

export const warning = style({
	position: 'relative',
	zIndex: 1,
});
