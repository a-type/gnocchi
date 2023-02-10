import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const tag = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space[1],
	padding: vars.space[1],
	paddingLeft: vars.space[3],
	paddingRight: vars.space[3],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.primaryLighter,
	color: vars.colors.primaryDarker,
});

export const list = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space[1],
});
