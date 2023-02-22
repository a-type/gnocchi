import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const blueberryTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLighter: '#DCFCE7',
		accentLight: '#86EFAC',
		accent: '#34D399',
		accentDark: '#18a86d',
		accentDarker: '#14532D',
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
