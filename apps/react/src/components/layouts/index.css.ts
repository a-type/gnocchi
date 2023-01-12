import { mediaQueries } from '@/styles/media.js';
import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const fixedArea = style({
	position: 'sticky',
	top: 0,
	zIndex: 1,
	backgroundColor: vars.colors.light,
	width: '100%',
	padding: vars.space[2],
	alignItems: 'stretch',
	gap: vars.space[2],
});

export const content = style({
	gridArea: 'content',
	width: '100%',
	display: 'grid',
	gridTemplateAreas: '"innerContent"',
	gridTemplateRows: '1fr',
	alignItems: 'start',
	justifyItems: 'center',
	position: 'relative',
	flex: 1,
	gap: vars.space[3],
	height: 'max-content',

	'@media': {
		[mediaQueries.sm]: {
			gridTemplateAreas: '"gutter1 nav innerContent gutter2"',
			gridTemplateColumns: '1fr auto min(800px, 60vw) 1fr',
		},
	},
});

export const innerContent = style({
	width: '100%',
	maxWidth: vars.sizes.content,
	flexDirection: 'column',
	marginBottom: 120,
	gridArea: 'innerContent',
	paddingLeft: vars.space[4],
	paddingRight: vars.space[4],
	paddingTop: vars.space[6],
	paddingBottom: vars.space[6],
});

export const contentNoPadding = style({
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
	paddingBottom: 0,

	'@media': {
		[mediaQueries.sm]: {
			paddingLeft: vars.space[4],
			paddingRight: vars.space[4],
			paddingTop: vars.space[4],
			paddingBottom: vars.space[4],
		},
	},
});
export const innerContentFullHeight = style({
	flex: 1,
});

export const pageRoot = style({
	display: 'grid',
	flex: '1 1 0',
	// minHeight: 0,
	gridTemplateAreas: '"content" "nowPlaying"',
	gridTemplateRows: '1fr auto',
	gridTemplateColumns: '1fr',
});

export const pageRootLemon = style({
	backgroundColor: vars.colors.primary,
});

export const section = style({
	background: vars.colors.white,
	borderRadius: vars.radii.lg,
	borderStyle: vars.borderStyles.solid,
	borderWidth: vars.borderWidths.default,
	borderColor: vars.colors.black,
	padding: vars.space[4],
	width: '100%',
	maxWidth: '80vw',
	'@media': {
		'(max-width: 640px)': {
			minWidth: 'auto',
		},
	},
});

export const sectionGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
	gap: vars.space[4],
	alignItems: 'start',
});

export const nav = style({
	gridArea: 'auto',
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	zIndex: vars.zIndices.nav,

	'@media': {
		[mediaQueries.sm]: {
			gridArea: 'nav',
			position: 'sticky',
			top: 0,
			height: 'auto',
			bottom: 'auto',
			left: 'auto',
			right: 'auto',
		},
	},
});

export const navInner = style({});

export const nowPlayingContainer = style({
	position: 'absolute',
	bottom: `100%`,
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space[2],
	alignItems: 'end',
	padding: vars.space[2],

	'@media': {
		[mediaQueries.sm]: {
			position: 'fixed',
			bottom: vars.space[3],
			left: '50%',
			transform: 'translateX(-50%)',
			top: 'auto',
			alignItems: 'end',
			width: '100%',
			maxWidth: 600,
			padding: 0,
		},
	},
});

export const nowPlaying = style({
	backgroundColor: vars.colors.light,
	padding: 2,
	borderRadius: vars.radii.xl,
	borderStyle: vars.borderStyles.solid,
	borderWidth: vars.borderWidths.default,
	borderColor: vars.colors.gray50,
	boxShadow: vars.shadows.md,
	minWidth: 32,
	alignItems: 'center',
	justifyContent: 'center',
});
