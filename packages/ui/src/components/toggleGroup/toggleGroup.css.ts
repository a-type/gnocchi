import { style } from '@vanilla-extract/css';
import { vars } from '../../styles.js';

export const root = style({
	display: 'inline-flex',
	backgroundColor: vars.colors.gray10,
	borderRadius: vars.radii.lg,
	gap: vars.space[1],
});

export const item = style({
	borderRadius: vars.radii.xl,
	backgroundColor: vars.colors.gray20,
	padding: `${vars.space[1]} ${vars.space[2]}`,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray30,
		},
		'&:active': {
			backgroundColor: vars.colors.gray40,
		},
		'&:focus-visible': {
			boxShadow: vars.shadows.focus,
			outline: 'none',
		},
		'&[data-state="on"]': {
			backgroundColor: vars.colors.primaryLight,
			color: vars.colors.black,
		},
	},
});
