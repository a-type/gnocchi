import { style } from '@vanilla-extract/css';

export const dialog = style({
	width: '100%',
	height: '100%',
	maxWidth: 'none',
	maxHeight: 'none',
	padding: 0,
	border: 'none',
	borderRadius: 0,
	display: 'flex',
	flexDirection: 'column',
});

export const capturer = style({
	flex: 1,
});
