import { createVar, keyframes, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

const fadeIn = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 },
});

export const spread = createVar('spread');
export const mask = createVar('mask');

export const root = style({
	vars: {
		[spread]: '48px',
		[mask]:
			'radial-gradient(ellipse, black 1%, black 50%, transparent 90%, transparent 100%)',
	},

	backdropFilter: 'blur(2px)',
	maskImage: mask,
	WebkitMaskImage: mask,
	position: 'fixed',
	pointerEvents: 'none',
	top: calc(spread).multiply(-1).toString(),
	right: calc(spread).multiply(-1).toString(),
	bottom: calc(spread).multiply(-1).toString(),
	left: calc(spread).multiply(-1).toString(),
	zIndex: -1,
	display: 'none',

	selectors: {
		'*[data-state="open"] + &': {
			display: 'block',

			'@media': {
				'(prefers-reduced-motion: no-preference)': {
					animationDuration: '400ms',
					animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
					animationName: fadeIn,
					animationFillMode: 'forwards',
					willChange: 'opacity',
				},
			},
		},
	},
});
