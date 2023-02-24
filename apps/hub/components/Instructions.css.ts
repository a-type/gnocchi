import { vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const step = style({
	display: 'flex',
	flexDirection: 'column',
	marginBottom: vars.space[5],
	width: '100%',
	padding: vars.space[1],
});

export const note = style({
	marginTop: vars.space[2],
	marginLeft: vars.space[8],
	maxWidth: '80%',
	width: 'max-content',
});

export const content = style({});
