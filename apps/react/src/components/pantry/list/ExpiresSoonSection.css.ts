import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
});

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[3],
});

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
	padding: vars.space[2],
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.gray10,
});

export const itemContent = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.space[2],
});

export const itemText = style({
	flex: 1,
});

export const expiresAt = style({
	marginLeft: 'auto',
	color: vars.colors.attentionDark,
});

export const itemActions = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'stretch',
	gap: vars.space[2],
});
