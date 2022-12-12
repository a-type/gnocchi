import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	padding: 0,
	margin: 0,
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	padding: vars.space[6],
	border: `1px solid ${vars.colors.gray50}`,
	borderRadius: vars.radii.lg,
	fontSize: vars.fontSizes.lg,

	transition: `0.2s ${vars.transitions.default}`,

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
			color: vars.colors.black,
			borderColor: vars.colors.black,
		},
	},
});
