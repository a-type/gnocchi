import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const list = style({
	paddingLeft: vars.space[4],
	margin: 0,
});

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: vars.space[2],
	marginBottom: vars.space[3],
});
