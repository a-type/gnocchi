import { style } from '@vanilla-extract/css';
import { vars } from '../../theme.css.js';

export const imageUploader = style({
	position: 'relative',
	overflow: 'hidden',
});

export const fileInput = style({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	opacity: 0,
	cursor: 'pointer',
});

export const dragging = style({
	backgroundColor: 'rgba(0, 0, 0, 0.1)',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '100%',
	height: '100%',
	position: 'absolute',
	top: 0,
	left: 0,
	gap: vars.space[3],
	pointerEvents: 'none',
});

export const draggingOver = style({
	backgroundColor: 'rgba(0, 0, 0, 0.2)',
});

export const draggingText = style({
	color: vars.colors.white,
});

export const draggingIcon = style({
	width: 50,
	height: 50,
	color: vars.colors.white,
});

export const image = style({
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	objectPosition: 'center',
});

export const remove = style({
	position: 'absolute',
	top: vars.space[2],
	right: vars.space[2],
	width: 32,
	height: 32,
	border: 'none',
	padding: vars.space[2],
	cursor: 'pointer',
	backgroundColor: vars.colors.white,
	color: vars.colors.black,
	borderRadius: '50%',
	transition: 'background-color 0.2s ease',
	boxShadow: vars.shadows.sm,
	':hover': {
		backgroundColor: vars.colors.gray20,
	},
});
