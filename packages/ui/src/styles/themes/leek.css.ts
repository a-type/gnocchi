import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const leekTheme = createTheme(contract, {
	colors: {
		attentionLight: 'var(--color-red-light)',
		attention: 'var(--color-red)',
		attentionDark: 'var(--color-red-dark)',
		accentWash: 'var(--color-yellow-wash)',
		accentLighter: 'var(--color-yellow-lighter)',
		accentLight: 'var(--color-yellow-light)',
		accent: 'var(--color-yellow)',
		accentDark: 'var(--color-yellow-dark)',
		accentDarker: 'var(--color-yellow-darker)',
		primaryWash: 'var(--color-green-wash)',
		primaryLighter: 'var(--color-green-lighter)',
		primaryLight: 'var(--color-green-light)',
		primary: 'var(--color-green)',
		primaryDark: 'var(--color-green-dark)',
		primaryDarker: 'var(--color-green-darker)',
		darkBlend: 'var(--color-dark-blend-warm)',
		lightBlend: 'var(--color-light-blend-warm)',
		...lightmodeGrays,
	},
	...commonTheme,
});
