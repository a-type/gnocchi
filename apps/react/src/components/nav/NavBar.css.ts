import { mediaQueries } from '@/styles/media.js';
import { vars } from '@/theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'stretch',
	justifyContent: 'space-around',
	width: '100%',
	borderRadius: 0,
	boxShadow: vars.shadows.lg,
	overflow: 'hidden',
	zIndex: vars.zIndices.nav,
	backgroundColor: vars.colors.gray10,
	borderTop: `1px solid ${vars.colors.gray20}`,
	padding: 2,
	height: 'auto',

	'@media': {
		[mediaQueries.sm]: {
			backgroundColor: 'transparent',
			flexDirection: 'column',
			borderRadius: 0,
			borderWidth: 0,
			borderStyle: 'none',
			borderColor: 'transparent',
			boxShadow: 'none',
			height: 'min-content',
			overflowY: 'auto',
			overflowX: 'hidden',
			justifyContent: 'start',
			alignItems: 'stretch',
			gap: vars.space[2],
		},
	},
});

export const button = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	whiteSpace: 'nowrap',
	paddingTop: vars.space[2],
	paddingBottom: vars.space[2],
	paddingLeft: vars.space[3],
	paddingRight: vars.space[3],
	backgroundColor: 'transparent',
	borderRadius: vars.radii.md,
	border: 'none',
	cursor: 'pointer',
	fontSize: vars.fontSizes.sm,
	transition: `background-color 0.2s ease-out, color 0.2s ease-out`,
	height: '100%',
	gap: 2,

	'@media': {
		[mediaQueries.sm]: {
			flexDirection: 'row-reverse',
			height: 'auto',
			justifyContent: 'end',
			gap: vars.space[2],
		},
	},
});

export const buttonActive = style({
	color: vars.colors.primaryDarker,

	'@media': {
		[mediaQueries.sm]: {
			backgroundColor: vars.colors.primaryLighter,
		},
	},
});

export const buttonText = style({
	overflow: 'hidden',
	paddingLeft: vars.space[1],
	display: 'inline-block',
	fontSize: vars.fontSizes.xxs,
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',

	'@media': {
		[mediaQueries.sm]: {
			fontSize: vars.fontSizes.md,
		},
	},
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

	'@media': {
		[mediaQueries.sm]: {
			padding: 6,
			borderRadius: '100%',
			backgroundColor: vars.colors.lightBlend,
		},
	},
});

export const icon = style({
	position: 'relative',
	zIndex: 1,

	selectors: {
		[`${buttonActive} &`]: {
			fill: vars.colors.primary,
		},
	},
});

export const logo = style({
	display: 'none',

	'@media': {
		[mediaQueries.sm]: {
			alignSelf: 'center',
			padding: vars.space[2],
			display: 'block',
			width: 80,
			height: 80,
		},
	},
});
