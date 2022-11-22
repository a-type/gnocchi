import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	position: 'fixed',
	bottom: vars.space[4],
	left: '50%',
	transform: 'translateX(-50%)',
	display: 'flex',
	flexDirection: 'row',
	width: 'min-content',
	borderRadius: vars.radii.lg,
	backgroundColor: vars.colors.light,
	boxShadow: vars.shadows.lg,
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: vars.colors.gray70,
	overflow: 'hidden',
	zIndex: vars.zIndices.nav,
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
