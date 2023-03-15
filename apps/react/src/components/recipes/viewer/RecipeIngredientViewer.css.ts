import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

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

export const addNoteIcon = style({
	color: vars.colors.gray70,
});

export const sectionHeader = style({
	fontWeight: vars.fontWeights.bold,
});

export const convertContent = style({
	zIndex: calc(vars.zIndices.dialog).add(1).toString(),
});

export const conversion = style({
	marginRight: 'auto',
	alignSelf: 'flex-start',
	fontStyle: 'italic',
	color: vars.colors.gray70,
});

export const conversionContent = style({
	paddingRight: vars.space[2],
});
