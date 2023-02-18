import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const list = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space[1],
	padding: vars.space[1],
});

export const tag = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space[1],
	padding: vars.space[1],
	paddingLeft: vars.space[3],
	paddingRight: vars.space[1],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.primaryLighter,
	color: vars.colors.primaryDarker,
});

export const tagRemoveButton = style({});

export const popover = style({
	maxWidth: 350,
});
