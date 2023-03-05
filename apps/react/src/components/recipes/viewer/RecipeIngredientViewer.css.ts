import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	gap: vars.space[2],
});

export const mainRow = style({
	display: 'flex',
	flexDirection: 'row',
	width: '100%',
});

export const text = style({
	flex: 1,
	display: 'block',
});

export const noteButton = style({
	marginLeft: vars.space[2],
});

export const noteIconWithNote = style({
	color: vars.colors.primaryDark,
	fill: vars.colors.primary,
	stroke: vars.colors.primaryDark,
});

export const sectionHeader = style({
	fontWeight: vars.fontWeights.bold,
});
