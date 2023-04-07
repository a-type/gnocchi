import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const eggplantTheme = createTheme(contract, {
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
		primaryLighter: 'var(--color-purple-lighter)',
		primaryWash: 'var(--color-purple-wash)',
		primaryLight: 'var(--color-purple-light)',
		primary: 'var(--color-purple)',
		primaryDark: 'var(--color-purple-dark)',
		primaryDarker: 'var(--color-purple-darker)',
		darkBlend: 'var(--color-dark-blend-warm)',
		lightBlend: 'var(--color-light-blend-warm)',
		...lightmodeGrays,
	},
	...commonTheme,
});
