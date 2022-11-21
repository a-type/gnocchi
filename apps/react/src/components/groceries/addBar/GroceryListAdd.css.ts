import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const menu = style({
	overflow: 'hidden',
});

export const menuList = style({
	display: 'flex',
	flexDirection: 'column',
	listStyle: 'none',
	margin: 0,
	padding: 0,
});

export const item = style({
	display: 'flex',
	alignItems: 'start',
	justifyContent: 'space-between',
	width: '100%',
	borderRadius: 0,
	paddingLeft: vars.space[4],
	paddingRight: vars.space[4],
	paddingTop: vars.space[2],
	paddingBottom: vars.space[2],

	selectors: {
		'& + &': {
			borderTopWidth: vars.borderWidths.thin,
			borderTopStyle: 'solid',
			borderTopColor: vars.colors.gray80,
		},
	},
});

export const itemHighlighted = style({
	backgroundColor: vars.colors.lemonLighter,
});

export const itemHidden = style({
	// visibility: 'hidden',
});