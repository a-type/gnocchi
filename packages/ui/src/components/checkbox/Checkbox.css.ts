import { vars } from '../../styles/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	width: 24,
	height: 24,
	flexShrink: 0,
	backgroundColor: vars.colors.white,
	border: `1px solid ${vars.colors.black}`,
	position: 'relative',
	borderRadius: vars.radii.sm,
	transition: `100ms ${vars.transitions.default}`,

	selectors: {
		'&:focus': {},
		'&:focus-visible': {
			outline: 'none',
			boxShadow: vars.shadows.focus,
			borderWidth: 1,
		},
		'&[data-state="checked"]': {
			backgroundColor: vars.colors.primaryLight,
			borderColor: vars.colors.primaryDark,
		},
		'&:hover:not(:disabled)': {
			boxShadow: `0 0 0 1px ${vars.colors.black}`,
		},
	},
});

export const indicator = style({
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
	color: vars.colors.black,
});
