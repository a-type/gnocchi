import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const text = style({});

export const content = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[3],
	alignItems: 'flex-start',
	background: vars.colors.primaryWash,
	color: vars.colors.black,
	padding: vars.space[4],
	borderRadius: vars.radii.lg,
	border: `1px solid ${vars.colors.primary}`,
	width: '100%',
});
