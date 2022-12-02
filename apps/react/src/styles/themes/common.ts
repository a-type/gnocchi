import { vars } from './contract.css.js';

export const commonTheme = {
	fonts: {
		sans: '"Inter", sans-serif',
		serif: '"Domine", serif',
		title: '"Libre Baskerville", serif',
	},
	fontSizes: {
		xs: '0.75rem',
		sm: '0.88888888888888888888rem',
		md: '1rem',
		lg: '1.25rem',
		xl: '1.33333333333333333333rem',
		'2xl': '1.5rem',
		'3xl': '2rem',
		'4xl': '2.666666666666666666666rem',
		'5xl': '3rem',
		'6xl': '4rem',
		'7xl': '5rem',
		'8xl': '6rem',
		'9xl': '7rem',
	},
	space: {
		1: '0.25rem',
		2: '0.5rem',
		3: '0.75rem',
		4: '1rem',
		5: '1.25rem',
		6: '1.5rem',
		7: '1.75rem',
		8: '2rem',
		9: '2.25rem',
		10: '2.5rem',
		11: '2.75rem',
		12: '3rem',
		20: '5rem',
	},
	radii: {
		sm: '0.25rem',
		md: '0.5rem',
		lg: '0.75rem',
		xl: '1rem',
	},
	borderWidths: {
		default: '1px',
	},
	borderStyles: {
		solid: 'solid',
	},
	sizes: {
		content: '700px',
		full: '100%',
	},
	shadows: {
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

		// focus outlines
		focus: `0 0 0 3px ${vars.colors.primary}`,
	},
	transitions: {
		springy: 'cubic-bezier(0.64, -0.25, 0.1, 1.4)',
		default: 'ease',
	},
	zIndices: {
		menu: '100',
		menuTrigger: '101',
		nav: '500',
		dialog: '1000',
		dialogBackdrop: '900',
	},
};

export const lightmodeGrays = {
	black: '#3c3c3c',
	white: '#ffffff',
	light: '#fdfdff',
	gray10: '#fafafa',
	gray20: '#f5f5f5',
	gray30: '#eeeef0',
	gray40: '#e0e0e3',
	gray50: '#bdbdbf',
	gray60: '#939ea0',
	gray70: '#757580',
	gray80: '#616168',
	gray90: '#42424a',
	gray0: '#21212b',
	grayBlend: 'rgba(0, 0, 20, 0.025)',
};
