import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	backgroundColor: vars.colors.tomato,
	padding: 2,
	borderRadius: '100%',
	color: 'white',
	width: 17,
	height: 17,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});