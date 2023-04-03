import { vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const checklist = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	listStyle: 'none',
	padding: 0,
	margin: 0,
	gap: vars.space[3],
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	gap: vars.space[2],
	width: '100%',
});

export const itemContent = style({
	flex: 1,
});

export const actions = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: vars.space[2],
	position: 'sticky',
	bottom: 0,
	width: '100%',
	backgroundColor: vars.colors.white,
});

export const mainContent = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: vars.space[3],
});

export const hidden = style({
	visibility: 'hidden',
});

export const sectionHeader = style({
	fontWeight: vars.fontWeights.bold,
});
