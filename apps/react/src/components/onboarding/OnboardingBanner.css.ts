import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	width: '100%',
});

export const content = style({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: vars.colors.primaryWash,
	color: vars.colors.primaryDarker,
	padding: vars.space[4],
	borderRadius: vars.radii.lg,
	gap: vars.space[3],
});

export const buttons = style({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: vars.space[3],
});