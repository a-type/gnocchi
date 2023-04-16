import {
	createGlobalTheme,
	globalFontFace,
	globalStyle,
} from '@vanilla-extract/css';
import { vars } from './themes/contract.css.js';

globalStyle('html', {
	vars: {
		'--palette-red-wash': '#ffe7e7',
		'--palette-red-lighter': '#ffc0c0',
		'--palette-red-light': '#fc9c7e',
		'--palette-red': '#fd7e4d',
		'--palette-red-dark': '#b03510',
		'--palette-red-darker': '#732207',
		'--palette-red-ink': '#3c0f03',
		'--palette-red-black': '#1a0a02',
		'--palette-green-wash': '#e8faf1',
		'--palette-green-lighter': '#DCFCE7',
		'--palette-green-light': '#86EFAC',
		'--palette-green': '#34D399',
		'--palette-green-dark': '#18a86d',
		'--palette-green-darker': '#14532D',
		'--palette-green-ink': '#0f2f1d',
		'--palette-green-black': '#0a1a0e',
		'--palette-yellow-wash': '#fff9e7',
		'--palette-yellow-lighter': '#fff1ba',
		'--palette-yellow-light': '#f9e794',
		'--palette-yellow': '#f9e794',
		'--palette-yellow-dark': '#f7d352',
		'--palette-yellow-darker': '#7d4c01',
		'--palette-yellow-ink': '#4d3508',
		'--palette-yellow-black': '#261a04',
		'--palette-blue-wash': '#F3F9FE',
		'--palette-blue-lighter': '#E0F2FE',
		'--palette-blue-light': '#BAE6FD',
		'--palette-blue': '#38BDF8',
		'--palette-blue-dark': '#0284C7',
		'--palette-blue-darker': '#0C4A6E',
		'--palette-blue-ink': '#062B42',
		'--palette-blue-black': '#03171A',
		'--palette-purple-wash': '#F3F4FF',
		'--palette-purple-lighter': '#E0E7FF',
		'--palette-purple-light': '#C7D2FE',
		'--palette-purple': '#818CF8',
		'--palette-purple-dark': '#4F46E5',
		'--palette-purple-darker': '#312E81',
		'--palette-purple-ink': '#1E2139',
		'--palette-purple-black': '#100E1C',
		'--palette-dark-blend-warm': 'rgba(30, 0, 0, 0.75)',
		'--palette-dark-blend-cool': 'rgba(0, 30, 0, 0.75)',
		'--palette-light-blend-warm': 'rgba(255, 250, 250, 0.5)',
		'--palette-light-blend-cool': 'rgba(250, 255, 255, 0.5)',
		'--palette-light-blend': 'rgba(255, 250, 250, 0.5)',
		'--palette-overlay': 'rgba(0, 0, 0, 0.025)',
		'--palette-black': '#303030',
		'--palette-white': '#fff',
		'--palette-light': '#fdfdff',
		'--palette-dark': '#080808',
		'--palette-gray-10': '#fafafa',
		'--palette-gray-20': '#f5f5f5',
		'--palette-gray-30': '#eeeef0',
		'--palette-gray-40': '#e0e0e3',
		'--palette-gray-50': '#bdbdbf',
		'--palette-gray-60': '#939ea0',
		'--palette-gray-70': '#6f7a7c',
		'--palette-gray-80': '#4d5658',
		'--palette-gray-90': '#3c3c3c',
		'--palette-gray-0': '#2b2b2b',
		'--palette-gray-ex-10': '#232323',
		'--palette-gray-ex-20': '#1b1b1b',
		'--palette-gray-blend': 'rgba(0, 0, 20, 0.025)',
		'--palette-gray-dark-blend': 'rgba(0, 0, 20, 0.05)',
		'--palette-light-gray-blend': 'rgba(255, 255, 255, 0.05)',
		'--palette-light-gray-dark-blend': 'rgba(255, 255, 255, 0.1)',

		// actual color implementations
		'--color-red-wash': 'var(--palette-red-wash)',
		'--color-red-lighter': 'var(--palette-red-lighter)',
		'--color-red-light': 'var(--palette-red-light)',
		'--color-red': 'var(--palette-red)',
		'--color-red-dark': 'var(--palette-red-dark)',
		'--color-red-darker': 'var(--palette-red-darker)',
		'--color-green-wash': 'var(--palette-green-wash)',
		'--color-green-lighter': 'var(--palette-green-lighter)',
		'--color-green-light': 'var(--palette-green-light)',
		'--color-green': 'var(--palette-green)',
		'--color-green-dark': 'var(--palette-green-dark)',
		'--color-green-darker': 'var(--palette-green-darker)',
		'--color-yellow-wash': 'var(--palette-yellow-wash)',
		'--color-yellow-lighter': 'var(--palette-yellow-lighter)',
		'--color-yellow-light': 'var(--palette-yellow-light)',
		'--color-yellow': 'var(--palette-yellow)',
		'--color-yellow-dark': 'var(--palette-yellow-dark)',
		'--color-yellow-darker': 'var(--palette-yellow-darker)',
		'--color-blue-wash': 'var(--palette-blue-wash)',
		'--color-blue-lighter': 'var(--palette-blue-lighter)',
		'--color-blue-light': 'var(--palette-blue-light)',
		'--color-blue': 'var(--palette-blue)',
		'--color-blue-dark': 'var(--palette-blue-dark)',
		'--color-blue-darker': 'var(--palette-blue-darker)',
		'--color-purple-wash': 'var(--palette-purple-wash)',
		'--color-purple-lighter': 'var(--palette-purple-lighter)',
		'--color-purple-light': 'var(--palette-purple-light)',
		'--color-purple': 'var(--palette-purple)',
		'--color-purple-dark': 'var(--palette-purple-dark)',
		'--color-purple-darker': 'var(--palette-purple-darker)',
		'--color-dark-blend-warm': 'var(--palette-dark-blend-warm)',
		'--color-dark-blend-cool': 'var(--palette-dark-blend-cool)',
		'--color-light-blend-warm': 'var(--palette-light-blend-warm)',
		'--color-light-blend-cool': 'var(--palette-light-blend-cool)',
		'--color-light-blend': 'var(--palette-light-blend)',
		'--color-overlay': 'var(--palette-overlay)',
		'--color-black': 'var(--palette-black)',
		'--color-white': 'var(--palette-white)',
		'--color-light': 'var(--palette-light)',
		'--color-gray-10': 'var(--palette-gray-10)',
		'--color-gray-20': 'var(--palette-gray-20)',
		'--color-gray-30': 'var(--palette-gray-30)',
		'--color-gray-40': 'var(--palette-gray-40)',
		'--color-gray-50': 'var(--palette-gray-50)',
		'--color-gray-60': 'var(--palette-gray-60)',
		'--color-gray-70': 'var(--palette-gray-70)',
		'--color-gray-80': 'var(--palette-gray-80)',
		'--color-gray-90': 'var(--palette-gray-90)',
		'--color-gray-0': 'var(--palette-gray-0)',
		'--color-gray-blend': 'var(--palette-gray-blend)',
		'--color-gray-dark-blend': 'var(--palette-gray-dark-blend)',
	},
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: {
				// basically reverse the color ranges
				'--color-red-wash': 'var(--palette-red-black)',
				'--color-red-lighter': 'var(--palette-red-ink)',
				'--color-red-light': 'var(--palette-red-darker)',
				'--color-red': 'var(--palette-red-dark)',
				'--color-red-dark': 'var(--palette-red)',
				'--color-red-darker': 'var(--palette-red-light)',
				'--color-green-wash': 'var(--palette-green-black)',
				'--color-green-lighter': 'var(--palette-green-ink)',
				'--color-green-light': 'var(--palette-green-darker)',
				'--color-green': 'var(--palette-green-dark)',
				'--color-green-dark': 'var(--palette-green)',
				'--color-green-darker': 'var(--palette-green-light)',
				'--color-yellow-wash': 'var(--palette-yellow-black)',
				'--color-yellow-lighter': 'var(--palette-yellow-ink)',
				'--color-yellow-light': 'var(--palette-yellow-darker)',
				'--color-yellow': 'var(--palette-yellow-dark)',
				'--color-yellow-dark': 'var(--palette-yellow)',
				'--color-yellow-darker': 'var(--palette-yellow-light)',
				'--color-blue-wash': 'var(--palette-blue-black)',
				'--color-blue-lighter': 'var(--palette-blue-ink)',
				'--color-blue-light': 'var(--palette-blue-darker)',
				'--color-blue': 'var(--palette-blue-dark)',
				'--color-blue-dark': 'var(--palette-blue)',
				'--color-blue-darker': 'var(--palette-blue-light)',
				'--color-purple-wash': 'var(--palette-purple-black)',
				'--color-purple-lighter': 'var(--palette-purple-ink)',
				'--color-purple-light': 'var(--palette-purple-darker)',
				'--color-purple': 'var(--palette-purple-dark)',
				'--color-purple-dark': 'var(--palette-purple)',
				'--color-purple-darker': 'var(--palette-purple-light)',
				'--color-dark-blend-warm': 'var(--palette-light-blend-cool)',
				'--color-dark-blend-cool': 'var(--palette-light-blend-warm)',
				'--color-light-blend-warm': 'var(--palette-dark-blend-cool)',
				'--color-light-blend-cool': 'var(--palette-dark-blend-warm)',
				'--color-light-blend': 'var(--palette-light-blend)',
				'--color-overlay': 'var(--palette-overlay)',
				'--color-black': 'var(--palette-white)',
				'--color-white': 'var(--palette-black)',
				'--color-light': 'var(--palette-dark)',
				'--color-gray-10': 'var(--palette-gray-ex-20)',
				'--color-gray-20': 'var(--palette-gray-ex-10)',
				'--color-gray-30': 'var(--palette-gray-0)',
				'--color-gray-40': 'var(--palette-gray-90)',
				'--color-gray-50': 'var(--palette-gray-80)',
				'--color-gray-60': 'var(--palette-gray-70)',
				'--color-gray-70': 'var(--palette-gray-60)',
				'--color-gray-80': 'var(--palette-gray-50)',
				'--color-gray-90': 'var(--palette-gray-40)',
				'--color-gray-0': 'var(--palette-gray-30)',
				'--color-gray-blend': 'var(--palette-light-gray-blend)',
				'--color-gray-dark-blend': 'var(--palette-light-gray-dark-blend)',
			},
		},
	},
});

// override system dark with light
globalStyle('html.override-light', {
	'@media': {
		'(prefers-color-scheme: dark)': {
			vars: {
				'--color-red-wash': 'var(--palette-red-wash)',
				'--color-red-lighter': 'var(--palette-red-lighter)',
				'--color-red-light': 'var(--palette-red-light)',
				'--color-red': 'var(--palette-red)',
				'--color-red-dark': 'var(--palette-red-dark)',
				'--color-red-darker': 'var(--palette-red-darker)',
				'--color-green-wash': 'var(--palette-green-wash)',
				'--color-green-lighter': 'var(--palette-green-lighter)',
				'--color-green-light': 'var(--palette-green-light)',
				'--color-green': 'var(--palette-green)',
				'--color-green-dark': 'var(--palette-green-dark)',
				'--color-green-darker': 'var(--palette-green-darker)',
				'--color-yellow-wash': 'var(--palette-yellow-wash)',
				'--color-yellow-lighter': 'var(--palette-yellow-lighter)',
				'--color-yellow-light': 'var(--palette-yellow-light)',
				'--color-yellow': 'var(--palette-yellow)',
				'--color-yellow-dark': 'var(--palette-yellow-dark)',
				'--color-yellow-darker': 'var(--palette-yellow-darker)',
				'--color-blue-wash': 'var(--palette-blue-wash)',
				'--color-blue-lighter': 'var(--palette-blue-lighter)',
				'--color-blue-light': 'var(--palette-blue-light)',
				'--color-blue': 'var(--palette-blue)',
				'--color-blue-dark': 'var(--palette-blue-dark)',
				'--color-blue-darker': 'var(--palette-blue-darker)',
				'--color-purple-wash': 'var(--palette-purple-wash)',
				'--color-purple-lighter': 'var(--palette-purple-lighter)',
				'--color-purple-light': 'var(--palette-purple-light)',
				'--color-purple': 'var(--palette-purple)',
				'--color-purple-dark': 'var(--palette-purple-dark)',
				'--color-purple-darker': 'var(--palette-purple-darker)',
				'--color-dark-blend-warm': 'var(--palette-dark-blend-warm)',
				'--color-dark-blend-cool': 'var(--palette-dark-blend-cool)',
				'--color-light-blend-warm': 'var(--palette-light-blend-warm)',
				'--color-light-blend-cool': 'var(--palette-light-blend-cool)',
				'--color-light-blend': 'var(--palette-light-blend)',
				'--color-overlay': 'var(--palette-overlay)',
				'--color-black': 'var(--palette-black)',
				'--color-white': 'var(--palette-white)',
				'--color-light': 'var(--palette-light)',
				'--color-gray-10': 'var(--palette-gray-10)',
				'--color-gray-20': 'var(--palette-gray-20)',
				'--color-gray-30': 'var(--palette-gray-30)',
				'--color-gray-40': 'var(--palette-gray-40)',
				'--color-gray-50': 'var(--palette-gray-50)',
				'--color-gray-60': 'var(--palette-gray-60)',
				'--color-gray-70': 'var(--palette-gray-70)',
				'--color-gray-80': 'var(--palette-gray-80)',
				'--color-gray-90': 'var(--palette-gray-90)',
				'--color-gray-0': 'var(--palette-gray-0)',
				'--color-gray-blend': 'var(--palette-gray-blend)',
				'--color-gray-dark-blend': 'var(--palette-gray-dark-blend)',
			},
		},
	},
});

globalStyle('html.override-dark', {
	vars: {
		'--color-red-wash': 'var(--palette-red-black)',
		'--color-red-lighter': 'var(--palette-red-ink)',
		'--color-red-light': 'var(--palette-red-darker)',
		'--color-red': 'var(--palette-red-dark)',
		'--color-red-dark': 'var(--palette-red)',
		'--color-red-darker': 'var(--palette-red-light)',
		'--color-green-wash': 'var(--palette-green-black)',
		'--color-green-lighter': 'var(--palette-green-ink)',
		'--color-green-light': 'var(--palette-green-darker)',
		'--color-green': 'var(--palette-green-dark)',
		'--color-green-dark': 'var(--palette-green)',
		'--color-green-darker': 'var(--palette-green-light)',
		'--color-yellow-wash': 'var(--palette-yellow-black)',
		'--color-yellow-lighter': 'var(--palette-yellow-ink)',
		'--color-yellow-light': 'var(--palette-yellow-darker)',
		'--color-yellow': 'var(--palette-yellow-dark)',
		'--color-yellow-dark': 'var(--palette-yellow)',
		'--color-yellow-darker': 'var(--palette-yellow-light)',
		'--color-blue-wash': 'var(--palette-blue-black)',
		'--color-blue-lighter': 'var(--palette-blue-ink)',
		'--color-blue-light': 'var(--palette-blue-darker)',
		'--color-blue': 'var(--palette-blue-dark)',
		'--color-blue-dark': 'var(--palette-blue)',
		'--color-blue-darker': 'var(--palette-blue-light)',
		'--color-purple-wash': 'var(--palette-purple-black)',
		'--color-purple-lighter': 'var(--palette-purple-ink)',
		'--color-purple-light': 'var(--palette-purple-darker)',
		'--color-purple': 'var(--palette-purple-dark)',
		'--color-purple-dark': 'var(--palette-purple)',
		'--color-purple-darker': 'var(--palette-purple-light)',
		'--color-dark-blend-warm': 'var(--palette-light-blend-cool)',
		'--color-dark-blend-cool': 'var(--palette-light-blend-warm)',
		'--color-light-blend-warm': 'var(--palette-dark-blend-cool)',
		'--color-light-blend-cool': 'var(--palette-dark-blend-warm)',
		'--color-light-blend': 'var(--palette-light-blend)',
		'--color-overlay': 'var(--palette-overlay)',
		'--color-black': 'var(--palette-white)',
		'--color-white': 'var(--palette-black)',
		'--color-light': 'var(--palette-dark)',
		'--color-gray-10': 'var(--palette-gray-ex-20)',
		'--color-gray-20': 'var(--palette-gray-ex-10)',
		'--color-gray-30': 'var(--palette-gray-0)',
		'--color-gray-40': 'var(--palette-gray-90)',
		'--color-gray-50': 'var(--palette-gray-80)',
		'--color-gray-60': 'var(--palette-gray-70)',
		'--color-gray-70': 'var(--palette-gray-60)',
		'--color-gray-80': 'var(--palette-gray-50)',
		'--color-gray-90': 'var(--palette-gray-40)',
		'--color-gray-0': 'var(--palette-gray-30)',
		'--color-gray-blend': 'var(--palette-light-gray-blend)',
		'--color-gray-dark-blend': 'var(--palette-light-gray-dark-blend)',
	},
});

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
	color: vars.colors.black,
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

globalFontFace('Londrina Outline', {
	src: 'url(/fonts/LondrinaOutline-Regular.ttf)',
	fontDisplay: 'swap',
	fontStyle: 'normal',
});
