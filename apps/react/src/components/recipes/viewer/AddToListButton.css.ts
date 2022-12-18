import { vars } from '@/theme.css.js';
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
	alignItems: 'center',
	gap: vars.space[2],
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
