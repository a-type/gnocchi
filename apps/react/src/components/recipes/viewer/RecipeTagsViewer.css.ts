import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const tag = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space[1],
	padding: vars.space[1],
	paddingLeft: vars.space[3],
	paddingRight: vars.space[3],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.primaryLight,
	color: vars.colors.black,
	fontWeight: vars.fontWeights.bold,
});

export const list = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space[1],
});
