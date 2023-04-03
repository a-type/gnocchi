import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css.js';

export const fixedArea = style({
	position: 'sticky',
	top: 0,
	zIndex: vars.zIndices.nav,
	backgroundColor: vars.colors.light,
	width: '100%',
	alignItems: 'stretch',
	gap: vars.space[2],
});
