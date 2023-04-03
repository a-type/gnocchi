import { vars } from '../../styles/theme.css.js';
import { style } from '@vanilla-extract/css';

export const swatch = style({
	backgroundColor: vars.colors.primary,
	width: 16,
	height: 16,
	borderRadius: 4,
});

export const pickerContent = style({
	zIndex: `calc(${vars.zIndices.dialog} + 1)`,
});

export const itemLabel = style({
	display: 'none',
});
