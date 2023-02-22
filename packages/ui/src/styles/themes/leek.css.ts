import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const leekTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLighter: '#fff1ba',
		accentLight: '#f9e794',
		accent: '#f9e794',
		accentDark: '#f7d352',
		accentDarker: '#996505',
		primaryWash: '#F0FAF5',
		primaryLighter: '#DCFCE7',
		primaryLight: '#86EFAC',
		primary: '#34D399',
		primaryDark: '#18a86d',
		primaryDarker: '#14532D',
		darkBlend: 'rgba(30, 0, 0, 0.75)',
		lightBlend: 'rgba(255, 250, 250, 0.5)',
		overlay: 'rgba(0, 0, 0, 0.025)',
		...lightmodeGrays,
	},
	...commonTheme,
});
