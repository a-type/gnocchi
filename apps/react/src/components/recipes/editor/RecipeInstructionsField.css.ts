import { vars } from '@/theme.css.js';
import { globalStyle, style } from '@vanilla-extract/css';

export const controlButton = style({
	fontSize: 12,
});

export const editor = style({});

globalStyle(`${editor} .ProseMirror`, {
	backgroundColor: vars.colors.gray10,
	borderRadius: vars.radii.md,
	padding: vars.space[4],
	border: `1px solid ${vars.colors.black}`,
});
