import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const list = style({
	listStyle: 'none',
	margin: 0,
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	padding: 0,
	width: '100%',
});

export const item = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	width: '100%',
});

export const itemChecked = style({});

export const ingredientContent = style({
	flex: 1,
});
