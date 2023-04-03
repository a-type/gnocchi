import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css.js';

export const root = style({
	all: 'unset',
	width: 42,
	height: 25,
	backgroundColor: vars.colors.white,
	borderRadius: '9999px',
	position: 'relative',
	WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
	transition: 'background-color 100ms',
	borderColor: vars.colors.black,
	borderStyle: 'solid',
	borderWidth: 1,
	flexShrink: 0,
	selectors: {
		'&:focus': { boxShadow: vars.shadows.focus },
		'&[data-state="checked"]': { backgroundColor: vars.colors.accent },
	},
});

export const thumb = style({
	display: 'block',
	width: 21,
	height: 21,
	backgroundColor: 'white',
	borderRadius: '9999px',
	borderColor: vars.colors.black,
	borderStyle: 'solid',
	borderWidth: 1,
	transition: 'transform 100ms',
	transform: 'translateX(2px)',
	willChange: 'transform',
	selectors: {
		'&[data-state="checked"]': { transform: 'translateX(19px)' },
	},
});
