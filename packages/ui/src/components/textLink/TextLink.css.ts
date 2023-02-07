import { vars } from '../../theme.css.js';
import { style } from '@vanilla-extract/css';

export const root = style({
	fontWeight: 'bold',
	cursor: 'pointer',
	fontSize: 'inherit',
	color: vars.colors.primaryDarker,
});
