import { style } from '@vanilla-extract/css';
import { mediaQueries } from '../../styles/media.js';
import { vars } from '../../theme.css.js';

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
	alignItems: 'flex-end',
	padding: vars.space[2],

	'@media': {
		[mediaQueries.sm]: {
			position: 'fixed',
			bottom: vars.space[3],
			left: '50%',
			transform: 'translateX(-50%)',
			top: 'auto',
			alignItems: 'flex-end',
			width: '100%',
			maxWidth: 600,
			padding: 0,
		},
	},
});
