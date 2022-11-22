import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'start',
	flexDirection: 'row',
	gap: vars.space[2],
	width: '100%',
	overflowY: 'hidden',
	overflowX: 'auto',
	paddingRight: vars.space[3],

	height: 52,

	transition: `height 0.2s ${vars.transitions.springy}`,

	selectors: {
		'&:empty': {
			height: 0,
		},
	},
});
