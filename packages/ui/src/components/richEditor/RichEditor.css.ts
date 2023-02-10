import { vars } from '../../theme.css.js';
import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
	width: '100%',
});

globalStyle(`${root} .ProseMirror`, {});
globalStyle(`${root} .ProseMirror:focus`, {
	outline: 'none',
	backgroundColor: vars.colors.gray10,
});
globalStyle(`${root} .ProseMirror h1, h2, h3, p`, {
	marginTop: 0,
});
globalStyle(`${root} .ProseMirror h1`, {
	fontSize: vars.fontSizes['xl'],
	fontWeight: vars.fontWeights.medium,
});
globalStyle(`${root} .ProseMirror h2`, {
	fontSize: vars.fontSizes['lg'],
	fontWeight: vars.fontWeights.medium,
	marginTop: vars.space[4],
	marginBottom: vars.space[2],
});
globalStyle(`${root} .ProseMirror h3`, {
	fontSize: vars.fontSizes['md'],
	fontWeight: vars.fontWeights.extrabold,
});
