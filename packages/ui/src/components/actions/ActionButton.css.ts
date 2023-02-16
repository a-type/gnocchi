import { vars } from '../../theme.css.js';
import { keyframes, style } from '@vanilla-extract/css';

export const root = style({
	borderColor: vars.colors.gray70,
	fontWeight: 'normal !important',
	whiteSpace: 'nowrap',
	margin: 8,
	display: 'flex',
	flexDirection: 'row',
	gap: vars.space[2],
	alignItems: 'center',
	height: 30,
	borderRadius: 15,
	marginLeft: 4,
	marginRight: 4,

	selectors: {
		'&:hover:not(:disabled):not([data-disabled="true"])': {
			backgroundColor: vars.colors.gray20,
		},
	},
});

export const outer = style({
	overflow: 'hidden',
});
