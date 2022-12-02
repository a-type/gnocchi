import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const title = style({
	fontSize: vars.fontSizes.sm,
	fontFamily: vars.fonts.sans,
	fontWeight: 'normal',
	textTransform: 'uppercase',
	fontStyle: 'italic',
	color: vars.colors.gray90,
	margin: 0,
	minWidth: 0,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	flex: '1 0 0',
});

const popIn = keyframes({
	'0%': {
		opacity: 0,
		transform: 'translateY(20px)',
	},
	'100%': {
		opacity: 1,
		transform: 'translateY(0px)',
	},
});

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	borderRadius: vars.radii.md,
	backgroundColor: vars.colors.light,
	overflow: 'hidden',
	transition: `box-shadow 0.2s ${vars.transitions.springy}, transform 0.2s ${vars.transitions.springy}, background-color 0.5s linear`,
	marginBottom: vars.space[4],

	selectors: {
		'&[data-dragged-over="true"]': {
			backgroundColor: vars.colors.primaryLighter,
			borderColor: vars.colors.primaryDark,
		},
		'&[data-is-item-dragging="true"]': {
			boxShadow: `0 0 0 1px ${vars.colors.gray30}`,
		},
		'&[data-is-empty="true"]': {
			height: 0,
			opacity: 0,
			pointerEvents: 'none',
			marginBottom: 0,
		},
		'&[data-is-item-dragging="true"][data-dragged-over="false"]': {
			transform: 'scale(0.95)',
		},
		'&[data-is-empty="false"][data-dragged-over="false"][data-is-item-dragging="false"]':
			{
				animationName: popIn,
				animationDuration: '0.2s',
				animationTimingFunction: vars.transitions.springy,
			},
	},
});

export const titleRow = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	paddingTop: vars.space[1],
	paddingBottom: vars.space[1],
	paddingLeft: vars.space[3],
	paddingRight: vars.space[3],
});

export const items = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],

	transition: `opacity 0.2s ${vars.transitions.springy}`,

	selectors: {
		'&[data-is-item-dragging="true"]': {
			opacity: 0,
		},
	},
});

export const claimGroup = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	flex: '0 0 auto',
});

export const claimButton = style({
	marginTop: vars.space[1],
	marginBottom: vars.space[1],
	height: 30,
});

export const claimAvatar = style({
	width: 20,
	height: 20,
});

export const claimIcon = style({
	opacity: 0.5,
	transition: `all 0.2s ${vars.transitions.springy}`,
});

export const claimIconActive = style({
	opacity: 1,
	stroke: vars.colors.accent,
	fill: vars.colors.accentLight,
});

export const claimCollapse = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space[1],
});

export const claimLabel = style({
	fontSize: vars.fontSizes.sm,
	fontFamily: vars.fonts.sans,
	fontWeight: 'normal',
	color: vars.colors.gray50,
	whiteSpace: 'nowrap',
});

export const claimAvatarSpacer = style({
	width: 20,
	height: 20,
});
