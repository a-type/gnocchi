import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
	maxWidth: 600,
});

globalStyle(`${root} .ProseMirror`, {});
