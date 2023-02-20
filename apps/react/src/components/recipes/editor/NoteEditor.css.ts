import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const unstyledTextarea = style({
	border: 'none',
	outline: 'none',
	resize: 'none',
	width: '100%',
	height: '100%',
	padding: 0,
	margin: 0,
	fontFamily: 'inherit',
	fontSize: 'inherit',
	color: 'inherit',
	fontStyle: 'inherit',
	backgroundColor: 'transparent',
	selectors: {
		'&:focus': {
			outline: 'none',
			background: 'transparent',
			border: 'transparent',
			boxShadow: 'none',
		},
	},
});

export const note = style({
	selectors: {
		'&:focus-within': {
			boxShadow: vars.shadows.focus,
		},
	},
});
