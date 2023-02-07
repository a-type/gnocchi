import { style } from '@vanilla-extract/css';
import { vars } from '../../theme.css.js';

export const fixedArea = style({
	position: 'sticky',
	top: 0,
	zIndex: 1,
	backgroundColor: vars.colors.light,
	width: '100%',
	alignItems: 'stretch',
	gap: vars.space[2],
});
