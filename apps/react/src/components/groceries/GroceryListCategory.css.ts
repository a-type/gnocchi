import { vars } from '@/theme.css.js';
import { style } from '@vanilla-extract/css';

export const title = style({
	fontSize: vars.fontSizes.sm,
	fontFamily: vars.fonts.sans,
	fontWeight: 'normal',
	textTransform: 'uppercase',
	fontStyle: 'italic',
	color: vars.colors.gray90,
	margin: vars.space[2],
});
