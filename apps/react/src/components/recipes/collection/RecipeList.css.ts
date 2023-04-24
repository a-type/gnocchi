import { mediaQueries, vars } from '@aglio/ui/styles';
import { style } from '@vanilla-extract/css';

export const root = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[4],
	padding: 0,
	margin: 0,
});

export const topRow = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
});

export const list = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gridAutoRows: 'auto',
	gap: vars.space[4],
	padding: 0,
	margin: 0,

	'@media': {
		[mediaQueries.md]: {
			gridTemplateColumns: 'repeat(2, 1fr)',
			gridAutoRows: '1fr',
			alignItems: 'end',
		},
	},
});

export const item = style({
	display: 'flex',
	flexDirection: 'column',
	border: `1px solid ${vars.colors.gray50}`,
	borderRadius: vars.radii.lg,
	fontSize: vars.fontSizes.lg,
	overflow: 'hidden',
	height: 'max-content',
	position: 'relative',
	backgroundColor: vars.colors.gray10,
	minHeight: 200,

	'@media': {
		[mediaQueries.md]: {
			height: '30vh',
		},
	},
});

export const tags = style({
	fontSize: vars.fontSizes.sm,
});

export const itemContent = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	cursor: 'pointer',
	transition: `0.2s ${vars.transitions.default}`,
	padding: vars.space[4],
	paddingBottom: vars.space[2],
	flex: 1,
	position: 'relative',
	zIndex: 1,

	selectors: {
		'&:hover': {
			backgroundColor: vars.colors.lightBlend,
			color: vars.colors.black,
		},
	},

	'@media': {
		[mediaQueries.md]: {
			paddingTop: vars.space[4],
		},
	},
});

export const itemTitle = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[1],
	marginTop: 'auto',
	backgroundColor: vars.colors.white,
	padding: vars.space[2],
	borderRadius: vars.radii.lg,
	width: 'auto',
	marginRight: 'auto',
	border: `1px solid ${vars.colors.grayDarkBlend}`,

	'@media': {
		[mediaQueries.md]: {
			// borderBottomRightRadius: 0,
			// borderTopLeftRadius: vars.radii.lg,
		},
	},
});

export const itemImage = style({
	selectors: {
		'&&': {
			position: 'absolute',
			zIndex: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: '100%',
			height: '100%',

			'@media': {
				[mediaQueries.md]: {},
			},
		},
	},
});

export const itemActions = style({
	gridArea: 'itemActions',
	display: 'flex',
	flexDirection: 'row',
	padding: vars.space[2],
	paddingTop: vars.space[2],
	backgroundColor: vars.colors.white,
	position: 'relative',
	zIndex: 1,
	borderTop: `1px solid ${vars.colors.grayDarkBlend}`,
});

export const itemActionButton = style({});

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

export const actionIcon = style({
	width: 20,
	height: 20,
});
