import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	width: 24,
	height: 24,
	backgroundColor: vars.colors.white,
	border: `1px solid currentColor`,
	position: 'relative',
	borderRadius: vars.radii.sm,

	selectors: {
		'&:focus': {},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadows.focus,
			borderWidth: 1,
		},
		'&[data-state="checked"]': {
			backgroundColor: vars.colors.primaryLighter,
			borderColor: vars.colors.primaryLight,
		},
	},
});

export const indicator = style({
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
});
