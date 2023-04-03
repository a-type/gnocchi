import { vars } from '@aglio/ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const popIn = keyframes({
	'0%': { opacity: 0, transform: 'scale(0.5)' },
	'100%': { opacity: 1, transform: 'scale(1)' },
});

export const root = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '100%',
	border: `1px solid ${vars.colors.black}`,
	padding: '2px',
	overflow: 'hidden',
	width: 24,
	height: 24,
	userSelect: 'none',
	position: 'relative',
	backgroundColor: vars.colors.white,

	selectors: {
		'&[data-pop="true"]': {
			animationName: popIn,
			animationDuration: '0.2s',
			animationTimingFunction: vars.transitions.springy,
		},
	},
});

export const image = style({
	width: '100%',
	height: '100%',
	objectFit: 'cover',
	borderRadius: '100%',
});

export const initials = style({
	color: vars.colors.black,
	alignItems: 'center',
	justifyContent: 'center',
	display: 'flex',
	fontSize: '12px',
	fontWeight: 'bold',
	borderRadius: '100%',
});

export const empty = style({
	borderStyle: 'dashed',
	backgroundColor: vars.colors.gray20,
});
