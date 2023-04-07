import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const blueberryTheme = createTheme(contract, {
	colors: {
		attentionLight: 'var(--color-red-light)',
		attention: 'var(--color-red)',
		attentionDark: 'var(--color-red-dark)',
		accentWash: 'var(--color-green-wash)',
		accentLighter: 'var(--color-green-lighter)',
		accentLight: 'var(--color-green-light)',
		accent: 'var(--color-green)',
		accentDark: 'var(--color-green-dark)',
		accentDarker: 'var(--color-green-darker)',
		primaryLighter: 'var(--color-blue-lighter)',
		primaryWash: 'var(--color-blue-wash)',
		primaryLight: 'var(--color-blue-light)',
		primary: 'var(--color-blue)',
		primaryDark: 'var(--color-blue-dark)',
		primaryDarker: 'var(--color-blue-darker)',
		darkBlend: 'var(--color-dark-blend-cool)',
		lightBlend: 'var(--color-light-blend-cool)',
		...lightmodeGrays,
	},
	...commonTheme,
});
