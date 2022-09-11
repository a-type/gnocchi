import { keyframes, styled } from '@/stitches.config.js';

const fadeIn = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 },
});
export const BlurLayer = styled('div', {
	$$spread: '48px',
	$$mask:
		'radial-gradient(ellipse, black 1%, black 50%, transparent 90%, transparent 100%)',
	backdropFilter: 'blur(2px)',
	maskImage: '$$mask',
	'-webkit-mask-image': '$$mask',
	'-moz-mask-image': '$$mask',
	position: 'fixed',
	pointerEvents: 'none',
	top: '-$$spread',
	left: '-$$spread',
	right: '-$$spread',
	bottom: '-$$spread',
	zIndex: '-1',
	'@media (prefers-reduced-motion: no-preference)': {
		animationDuration: '400ms',
		animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
		animationFillMode: 'forwards',
		animationName: fadeIn,
		willChange: 'opacity',
	},
});
