import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const lemonTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLight: '#e0f8bb',
		accent: '#3ec188',
		accentDark: '#1e5a3e',
		primaryLighter: '#fff1ba',
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
