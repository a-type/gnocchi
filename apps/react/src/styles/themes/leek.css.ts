import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const leekTheme = createTheme(contract, {
	colors: {
		attentionLight: '#ffc0c0',
		attention: '#fd7e4d',
		attentionDark: '#732207',
		accentLight: '#fff1ba',
		accent: '#f7d352',
		accentDark: '#996505',
		primaryLighter: '#DCFCE7',
		primaryLight: '#86EFAC',
		primary: '#34D399',
		primaryDark: '#22C55E',
		primaryDarker: '#14532D',
		darkBlend: 'rgba(30, 0, 0, 0.75)',
		lightBlend: 'rgba(255, 250, 250, 0.5)',
		overlay: 'rgba(0, 0, 0, 0.025)',
		...lightmodeGrays,
	},
	...commonTheme,
});
