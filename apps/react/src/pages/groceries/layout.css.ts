import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const topControlsRoot = style({
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	gap: vars.space[2],
	padding: vars.space[2],
	marginTop: vars.space[1],
});

export const listSelectRoot = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.space[2],
});

export const listSelectFallback = style({
	height: 28,
	width: '100%',
});

export const addBarRoot = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
	padding: vars.space[2],
});

export const addBarFallback = style({
	width: '100%',
	height: 41,
});
