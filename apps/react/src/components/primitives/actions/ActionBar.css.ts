import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'start',
	flexDirection: 'row',
	width: '100%',
	overflow: 'hidden',
	position: 'relative',

	height: 52,

	transition: `height 0.2s ${vars.transitions.springy}`,

	selectors: {
		'&:empty': {
			height: 0,
		},

		'&::after': {
			content: '""',
			position: 'absolute',
			right: 0,
			top: 0,
			bottom: 0,
			width: 50,
			background: `linear-gradient(to left, ${vars.colors.light} 0%, rgba(255, 255, 255, 0) 100%)`,
			pointerEvents: 'none',
		},
	},
});

export const content = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'start',
	flexDirection: 'row',
	gap: vars.space[2],
	width: '100%',
	overflowY: 'hidden',
	overflowX: 'auto',
	paddingRight: 80,
	position: 'relative',

	selectors: {
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
});
