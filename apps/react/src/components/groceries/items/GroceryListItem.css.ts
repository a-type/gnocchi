import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

const popUp = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(30px) scale(0.95)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0) scale(1)',
	},
});

const disappear = keyframes({
	'0%': {
		opacity: 1,
		transform: 'translateY(0)',
		height: 'var(--height)',
	},
	'25%': {
		opacity: 1,
		transform: 'translateY(0)',
		height: 'var(--height)',
	},
	'100%': {
		opacity: 0,
		transform: 'translateY(30px)',
		height: 0,
	},
});

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	width: '100%',
	gap: vars.space[2],
	backgroundColor: vars.colors.light,
	borderRadius: vars.radii.md,
	position: 'relative',
	animation: 'none',
	userSelect: 'none',

	transition: `all 0.2s ${vars.transitions.springy}`,

	selectors: {
		'&[data-dragging="true"]': {
			boxShadow: vars.shadows.xl,
			cursor: 'grabbing',
			touchAction: 'none',
			border: `1px solid ${vars.colors.gray50}`,
		},
		'&[data-highlighted="true"]': {
			backgroundColor: vars.colors.lemonLighter,
		},
		'&[data-menu-open="true"]': {
			backgroundColor: vars.colors.white,
			border: `1px solid ${vars.colors.gray50}`,
		},
		'&[data-just-moved="true"][data-hidden=state="visible"]': {
			animationName: popUp,
			animationDuration: '0.4s',
			animationTimingFunction: vars.transitions.springy,
		},
		'&[data-hidden-state="hiding"]': {
			animationName: disappear,
			animationDuration: '3s',
			animationTimingFunction: 'ease-out',
			animationFillMode: 'forwards',
		},
		'&[data-hidden-state="hidden"]': {
			display: 'none',
		},
	},
});

export const mainContent = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	gap: vars.space[2],
	padding: vars.space[3],
});

export const peopleStack = style({
	display: 'flex',
	flexDirection: 'row',
});

export const person = style({
	position: 'relative',
	zIndex: 'var(--index)',
	left: 'calc(var(--index) * -8px)',
});

export const textContent = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
	flex: '1',
});

export const secondaryContent = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	justifyContent: 'flex-end',
	padding: vars.space[3],
});

const expand = keyframes({
	from: {
		transform: 'scaleX(0)',
	},
	to: {
		transform: 'scaleX(1)',
	},
});

export const strikethrough = style({
	position: 'absolute',
	left: 48,
	right: 48,
	top: '28px',
	borderBottom: `1px solid ${vars.colors.gray70}`,
	height: '1px',
	transformOrigin: 'left',
	animationName: expand,
	animationDuration: '0.1s',
	animationTimingFunction: 'ease-out',
});
