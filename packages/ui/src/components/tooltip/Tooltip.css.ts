import { mediaQueries } from '../../styles/media.js';
import { vars } from '../../styles/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

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
	position: 'relative',
	borderRadius: vars.radii.lg,
	padding: `${vars.space[2]} ${vars.space[3]}`,
	border: `1px solid ${vars.colors.black}`,
	fontSize: vars.fontSizes.sm,
	lineHeight: 1,
	color: 'inherit',
	backgroundColor: vars.colors.white,
	boxShadow:
		'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	userSelect: 'none',
	// hide on mobile
	display: 'none',
	zIndex: vars.zIndices.tooltip,

	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			animationDuration: '400ms',
			animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
			willChange: 'transform, opacity',
			selectors: {
				'&[data-state="delayed-open"][data-side="top"]': {
					animationName: slideDownAndFade,
				},
				'&[data-state="delayed-open"][data-side="right"]': {
					animationName: slideLeftAndFade,
				},
				'&[data-state="delayed-open"][data-side="bottom"]': {
					animationName: slideUpAndFade,
				},
				'&[data-state="delayed-open"][data-side="left"]': {
					animationName: slideRightAndFade,
				},
			},
		},
		[mediaQueries.sm]: {
			display: 'initial',
		},
	},
});

export const arrow = style({
	fill: vars.colors.white,
	stroke: vars.colors.black,
	strokeWidth: 1,
});
