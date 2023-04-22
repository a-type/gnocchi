import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css.js';

export const root = style({
	paddingRight: 20,
});

export const inner = style({
	display: 'flex',
	flexDirection: 'column',
	padding: vars.space[2],
	border: `1px solid ${vars.colors.primaryDark}`,
	backgroundColor: vars.colors.primaryWash,
	color: vars.colors.black,
	position: 'relative',
	fontSize: vars.fontSizes.sm,
	fontStyle: 'italic',
	borderRight: 'none',
});

export const corner = style({
	position: 'absolute',
	top: -20,
	left: 0,
	// using borders to create a triangle
	border: '10px solid transparent',
	borderBottomColor: vars.colors.primaryDark,
	borderLeftColor: vars.colors.primaryDark,

	'::after': {
		content: '""',
		position: 'absolute',
		top: -7,
		left: -9,
		border: '8px solid transparent',
		borderBottomColor: vars.colors.primaryWash,
		borderLeftColor: vars.colors.primaryWash,
	},
});

export const edge = style({
	width: 20,
	height: 'calc(100% - 18px)',
	position: 'absolute',
	bottom: -1,
	right: -20,
	borderRight: `1px solid ${vars.colors.primaryDark}`,
	borderBottom: `1px solid ${vars.colors.primaryDark}`,
	background: vars.colors.primaryWash,
});
