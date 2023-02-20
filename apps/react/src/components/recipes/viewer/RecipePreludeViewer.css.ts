import { vars } from '@aglio/ui';
import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
	width: '100%',
});

export const editor = style({});

globalStyle(`${editor} .ProseMirror h1`, {
	fontSize: vars.fontSizes.lg,
});

globalStyle(`${editor} .ProseMirror h2`, {
	fontSize: vars.fontSizes.lg,
	fontWeight: vars.fontWeights.light,
});

globalStyle(`${editor} .ProseMirror h3`, {
	fontSize: vars.fontSizes.md,
});
