import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
});

export const listContainer = style({
	border: `1px solid ${vars.colors.gray50}`,
	borderRadius: vars.radii.lg,
	padding: vars.space[2],
});

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
	alignItems: 'stretch',
	padding: vars.space[2],
});

export const itemMainLine = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'flex-start',
});

export const itemNote = style({});

export const itemText = style({
	flex: 1,
	minWidth: 40,
	marginTop: 4,
});

export const dragHandle = style({
	touchAction: 'none',
	position: 'relative',
	top: 8,
});

export const itemHeader = style({
	fontWeight: vars.fontWeights.bold,
});
