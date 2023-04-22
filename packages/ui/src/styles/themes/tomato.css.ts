import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const tomatoTheme = createTheme(contract, {
	...commonTheme,
	colors: {
		attentionLight: 'var(--color-blue-light)',
		attention: 'var(--color-blue)',
		attentionDark: 'var(--color-blue-dark)',
		accentWash: 'var(--color-green-wash)',
		accentLight: 'var(--color-green-light)',
		accent: 'var(--color-green)',
		accentDark: 'var(--color-green-dark)',
		primaryWash: 'var(--color-red-wash)',
		primary: 'var(--color-red)',
		primaryLight: 'var(--color-red-light)',
		primaryDark: 'var(--color-red-dark)',

		darkBlend: 'var(--color-dark-blend-warm)',
		lightBlend: 'var(--color-light-blend-warm)',
		...lightmodeGrays,
	},
});
