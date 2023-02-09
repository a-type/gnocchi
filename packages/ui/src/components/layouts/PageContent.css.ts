import { style } from '@vanilla-extract/css';
import { mediaQueries } from '../../styles/media.js';
import { vars } from '../../theme.css.js';

export const content = style({
	gridArea: 'content',
	width: '100%',
	display: 'grid',
	gridTemplateAreas: '"innerContent"',
	gridTemplateRows: '1fr',
	alignItems: 'flex-start',
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
