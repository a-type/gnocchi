import { keyframes, style } from '@vanilla-extract/css';

const gradientMove = keyframes({
	'0%': {
		backgroundPosition: '0% 50%',
	},
	'100%': {
		backgroundPosition: '100% 50%',
	},
});

export const blob = style({
	width: '100%',
	height: '100%',
	borderRadius: '8px',
	background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
	backgroundSize: '400% 400%',
	maxWidth: '100%',

	'@media': {
		'(prefers-reduced-motion: no-preference)': {
			animation: `${gradientMove} 1.2s ease-in-out infinite alternate`,
		},
	},
});
