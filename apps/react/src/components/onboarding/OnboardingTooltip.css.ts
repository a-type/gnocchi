import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const buttons = style({
	display: 'flex',
	justifyContent: 'space-between',
});

export const content = style({
	backgroundColor: vars.colors.primaryWash,
	display: 'flex',
	flexDirection: 'column',
	gap: 3,
});

export const arrow = style({
	fill: vars.colors.primaryWash,
});
