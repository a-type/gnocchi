import { style } from '@vanilla-extract/css';
import { mediaQueries, vars } from '../../styles.js';

export const root = style({});

export const list = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	padding: `${vars.space[3]} ${vars.space[2]}`,
	justifyContent: 'center',
});

export const trigger = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space[2],
	color: vars.colors.black,
	padding: `${vars.space[1]} ${vars.space[4]}`,
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.gray10,
	fontSize: vars.fontSizes.md,
	fontWeight: 'bold',
	minWidth: '100px',
	border: `1px solid ${vars.colors.gray70}`,

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
		},
		'&:focus-visible': {
			boxShadow: vars.shadows.focus,
			outline: 'none',
		},
		'&[data-state="active"]': {
			backgroundColor: vars.colors.primaryLight,
			borderColor: vars.colors.primaryLight,
		},
	},
});

export const content = style({});
