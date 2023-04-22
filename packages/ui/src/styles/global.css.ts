import {
	createGlobalTheme,
	globalFontFace,
	globalStyle,
} from '@vanilla-extract/css';
import { vars } from './themes/contract.css.js';

const themeColors = ['red', 'green', 'yellow', 'blue', 'purple'];
function roundTens(num: number) {
	return Math.round(num / 10) * 10;
}
function asPaletteValue(num: number) {
	return roundTens(num).toString().padStart(2, '0');
}
function generateColors(from: number, to: number) {
	const increment = (to - from) / 3;
	return themeColors.reduce((acc, color) => {
		acc[`--color-${color}-wash`] = `var(--palette-${color}-${asPaletteValue(
			from,
		)})`;
		acc[`--color-${color}-light`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment),
		)})`;
		acc[`--color-${color}`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment * 2),
		)})`;
		acc[`--color-${color}-dark`] = `var(--palette-${color}-${asPaletteValue(
			from + roundTens(increment * 3),
		)})`;
		return acc;
	}, {} as Record<string, string>);
}

const lightColors = generateColors(90, 40);
const darkColors = generateColors(0, 60);

globalStyle('html', {
	vars: {
		'--palette-red-90': '#ffede7',
		'--palette-red-80': '#ffdbcf',
		'--palette-red-70': '#ffb59b',
		'--palette-red-60': '#ff8c60',
		'--palette-red-50': '#e66d3d',
		'--palette-red-40': '#c55427',
		'--palette-red-30': '#a43d0f',
		'--palette-red-20': '#943102',
		'--palette-red-10': '#812900',
		'--palette-red-00': '#380d00',
		'--palette-green-90': '#e9ffec',
		'--palette-green-80': '#c2ffd2',
		'--palette-green-70': '#8ff8b4',
		'--palette-green-60': '#73db9a',
		'--palette-green-50': '#56bf80',
		'--palette-green-40': '#38a368',
		'--palette-green-30': '#0f8850',
		'--palette-green-20': '#006d3e',
		'--palette-green-10': '#005f35',
		'--palette-green-00': '#00391d',
		'--palette-yellow-90': '#fff8ef',
		'--palette-yellow-80': '#fff0c7',
		'--palette-yellow-70': '#ffe17c',
		'--palette-yellow-60': '#f7d352',
		'--palette-yellow-50': '#c9a829',
		'--palette-yellow-40': '#ac8e04',
		'--palette-yellow-30': '#8e7500',
		'--palette-yellow-20': '#715c00',
		'--palette-yellow-10': '#635100',
		'--palette-yellow-00': '#3b2f00',
		'--palette-blue-90': '#e3f3ff',
		'--palette-blue-80': '#c4e7ff',
		'--palette-blue-70': '#7bd0ff',
		'--palette-blue-60': '#2db7f2',
		'--palette-blue-50': '#009bd1',
		'--palette-blue-40': '#0080ad',
		'--palette-blue-30': '#00668a',
		'--palette-blue-20': '#005979',
		'--palette-blue-10': '#004c69',
		'--palette-blue-00': '#00354a',
		'--palette-purple-90': '#f1efff',
		'--palette-purple-80': '#e0e0ff',
		'--palette-purple-70': '#bdc2ff',
		'--palette-purple-60': '#9ba4ff',
		'--palette-purple-50': '#7c87f3',
		'--palette-purple-40': '#626dd7',
		'--palette-purple-30': '#4953bc',
		'--palette-purple-20': '#3c47af',
		'--palette-purple-10': '#2f3aa3',
		'--palette-purple-00': '#000767',
		'--palette-dark-blend-warm': 'rgba(10, 0, 0, 0.75)',
		'--palette-dark-blend-cool': 'rgba(0, 10, 0, 0.75)',
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
		...lightColors,
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
				...darkColors,
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
				...lightColors,
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
		...darkColors,
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
