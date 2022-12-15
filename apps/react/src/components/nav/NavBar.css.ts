import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	position: 'fixed',
	bottom: vars.space[4],
	left: '50%',
	transform: 'translateX(-50%)',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'stretch',
	width: 'min-content',
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.light,
	boxShadow: vars.shadows.lg,
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: vars.colors.gray70,
	overflow: 'hidden',
	zIndex: vars.zIndices.nav,
	height: 37,
});

const shake = keyframes({
	'0%': { transform: 'scale(1) rotate(-5deg)' },
	'10%': { transform: 'scale(1.25) rotate(5deg)', color: vars.colors.accent },
	'20%': {
		transform: 'scale(1.25) rotate(-5deg)',
		color: vars.colors.accent,
	},
	'30%': { transform: 'scale(1.25) rotate(5deg)', color: vars.colors.accent },
	'40%': {
		transform: 'scale(1.25) rotate(-5deg)',
		color: vars.colors.accent,
	},
	'50%': { transform: 'scale(1.25) rotate(5deg)', color: vars.colors.accent },
	'60%': {
		transform: 'scale(1.25) rotate(-5deg)',
		color: vars.colors.accent,
	},
	'70%': { transform: 'scale(1.25) rotate(5deg)', color: vars.colors.accent },
	'80%': {
		transform: 'scale(1.25) rotate(-5deg)',
		color: vars.colors.accent,
	},
	'90%': { transform: 'scale(1.25) rotate(5deg)', color: vars.colors.accent },
	'100%': { transform: 'scale(1) rotate(0deg)' },
});

export const button = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	whiteSpace: 'nowrap',
	paddingTop: vars.space[1],
	paddingBottom: vars.space[1],
	paddingLeft: vars.space[3],
	paddingRight: vars.space[3],
	backgroundColor: 'transparent',
	border: 'none',
	gap: vars.space[1],
	cursor: 'pointer',
	fontSize: vars.fontSizes.sm,
	transition: `background-color 0.2s ease-out`,
	height: '100%',

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
		},

		'& + &': {
			borderLeft: `1px solid ${vars.colors.gray70}`,
		},

		'&[data-shake="true"]': {
			animationName: shake,
			animationDuration: '3s',
			animationIterationCount: '1',
			animationTimingFunction: vars.transitions.springy,
		},
	},
});

export const buttonText = style({
	overflow: 'hidden',
	paddingLeft: vars.space[1],
	display: 'inline-block',
});

export const collapsible = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	animationTimingFunction: 'linear !important',
});

export const iconContainer = style({
	position: 'relative',
	display: 'flex',
});

export const icon = style({
	position: 'relative',
	zIndex: 1,
});
