import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const lemonTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLighter: '#DCFCE7',
		accentLight: '#86EFAC',
		accent: '#34D399',
		accentDark: '#18a86d',
		accentDarker: '#14532D',
		primaryLighter: '#fff1ba',
		primaryWash: '#fff9e7',
		primaryLight: '#f9e794',
		primary: '#f9e794',
		primaryDark: '#f7d352',
		primaryDarker: '#996505',
		darkBlend: 'rgba(30, 0, 0, 0.75)',
		lightBlend: 'rgba(255, 250, 250, 0.5)',
		overlay: 'rgba(0, 0, 0, 0.025)',
		...lightmodeGrays,
	},
	...commonTheme,
});
