import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const blueberryTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLight: '#e0f8bb',
		accentLighter: '#f0fde0',
		accent: '#3ec188',
		accentDark: '#1e5a3e',
		accentDarker: '#0c2d1f',
		primaryLighter: '#E0F2FE',
		primaryWash: '#F3F9FE',
		primaryLight: '#BAE6FD',
		primary: '#38BDF8',
		primaryDark: '#0284C7',
		primaryDarker: '#0C4A6E',
		darkBlend: 'rgba(0, 30, 0, 0.75)',
		lightBlend: 'rgba(255, 250, 250, 0.5)',
		overlay: 'rgba(0, 0, 0, 0.025)',
		...lightmodeGrays,
	},
	...commonTheme,
});