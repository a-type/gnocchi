import { style } from '@vanilla-extract/css';

export const list = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '1rem',
	listStyle: 'none',
	margin: 0,
	padding: 0,
});

export const item = style({
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
});
