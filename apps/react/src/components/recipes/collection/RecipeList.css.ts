import { vars } from '@aglio/ui';
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
	flexDirection: 'column',
	alignItems: 'flex-start',
	padding: vars.space[6],
	border: `1px solid ${vars.colors.gray50}`,
	borderRadius: vars.radii.lg,
	fontSize: vars.fontSizes.lg,
	gap: vars.space[1],

	transition: `0.2s ${vars.transitions.default}`,

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
			color: vars.colors.black,
			borderColor: vars.colors.black,
		},
	},
});

export const tags = style({
	fontSize: vars.fontSizes.sm,
});
