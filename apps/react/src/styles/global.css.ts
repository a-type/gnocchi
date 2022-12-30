import {
	createGlobalTheme,
	globalFontFace,
	globalStyle,
} from '@vanilla-extract/css';
import { vars } from './themes/contract.css.js';

globalStyle('html, body', {
	margin: 0,
	padding: 0,
	fontFamily: vars.fonts.sans,
	fontSize: '18px',
	height: '100%',
	WebkitFontSmoothing: 'antialiased',
});

globalStyle('body', {
	height: '100%',
	backgroundColor: vars.colors.light,
	overflow: 'overlay',
});

globalStyle('#root', {
	display: 'flex',
	flexDirection: 'column',
	minHeight: '100%',
});

globalStyle('a', {
	color: 'inherit',
	textDecoration: 'none',
});

globalStyle('*', {
	boxSizing: 'border-box',
	WebkitTapHighlightColor: 'transparent',
});

createGlobalTheme(':root', vars);

globalFontFace('Inter', {
	// variable fonts!
	src: 'url(/fonts/Inter-VariableFont_slnt,wght.ttf) format("truetype-variations")',
	fontWeight: '1 999',
	fontStyle: 'oblique 0deg 5deg',
	fontDisplay: 'swap',
});
