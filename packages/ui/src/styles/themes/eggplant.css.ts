import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const eggplantTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLighter: '#DCFCE7',
		accentLight: '#86EFAC',
		accent: '#34D399',
		accentDark: '#18a86d',
		accentDarker: '#14532D',
		primaryLighter: '#E0E7FF',
		primaryWash: '#F3F4FF',
		primaryLight: '#C7D2FE',
		primary: '#818CF8',
		primaryDark: '#4F46E5',
		primaryDarker: '#312E81',
		darkBlend: 'rgba(30, 20, 0, 0.75)',
		lightBlend: 'rgba(255, 250, 250, 0.5)',
		overlay: 'rgba(0, 0, 0, 0.025)',
		...lightmodeGrays,
	},
	...commonTheme,
});
