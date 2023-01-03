import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
	marginBottom: 300,
});

globalStyle(`${root} .ProseMirror`, {});
