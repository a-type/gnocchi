import { mediaQueries, vars } from '@aglio/ui';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	padding: 0,
	margin: 0,
});

export const list = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gridAutoRows: '1fr',
	gap: vars.space[4],
	padding: 0,
	margin: 0,

	'@media': {
		[mediaQueries.md]: {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
	},
});

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	border: `1px solid ${vars.colors.gray50}`,
	borderRadius: vars.radii.lg,
	fontSize: vars.fontSizes.lg,
	overflow: 'hidden',

	'@media': {
		[mediaQueries.md]: {
			height: 'max-content',
		},
	},
});

export const tags = style({
	fontSize: vars.fontSizes.sm,
});

export const itemContent = style({
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
	cursor: 'pointer',
	transition: `0.2s ${vars.transitions.default}`,
	padding: vars.space[4],
	flex: 1,

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.gray20,
			color: vars.colors.black,
		},
	},

	'@media': {
		[mediaQueries.md]: {
			flexDirection: 'column-reverse',
		},
	},
});

export const itemTitle = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	flex: 1,
});

export const itemImage = style({
	width: '80px !important',
	height: '80px !important',
	flexShrink: 0,

	'@media': {
		[mediaQueries.md]: {
			width: '100% !important',
			height: `130px !important`,
		},
	},
});

export const itemActions = style({
	gridArea: 'itemActions',
	display: 'flex',
	flexDirection: 'row',
	padding: vars.space[2],
	paddingTop: vars.space[2],
});

export const itemActionsStart = style({
	marginLeft: 0,
	marginRight: 'auto',
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
	alignItems: 'center',
});

export const itemActionsEnd = style({
	marginRight: 0,
	marginLeft: 'auto',
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[1],
	alignItems: 'center',
});
