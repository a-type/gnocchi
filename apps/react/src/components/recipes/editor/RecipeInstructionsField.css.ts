import { vars } from '@/theme.css.js';
import { globalStyle, style } from '@vanilla-extract/css';

export const controlButton = style({
	fontSize: 12,
});

export const editor = style({});

globalStyle(`${editor} .ProseMirror`, {
	backgroundColor: 'transparent',
	borderRadius: vars.radii.md,
	padding: vars.space[2],
});
globalStyle(`${editor} .ProseMirror:focus`, {
	outline: 'none',
	backgroundColor: vars.colors.gray10,
});
globalStyle(`${editor} .ProseMirror h1, h2, h3, p`, {
	marginTop: 0,
});
