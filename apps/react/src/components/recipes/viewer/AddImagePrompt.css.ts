import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[3],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.gray20,
	padding: vars.space[3],
	marginTop: vars.space[4],
});

export const uploader = style({
	height: 200,
	borderRadius: vars.radii.sm,
	overflow: 'hidden',
});
