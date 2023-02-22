import { createTheme } from '@vanilla-extract/css';
import { commonTheme, lightmodeGrays } from './common.js';
import { vars as contract } from './contract.css.js';

export const tomatoTheme = createTheme(contract, {
	...commonTheme,
	colors: {
		attentionLight: '#d4fff8',
		attention: '#2cdbbe',
		attentionDark: '#035754',
		accentLighter: '#DCFCE7',
		accentLight: '#86EFAC',
		accent: '#34D399',
		accentDark: '#18a86d',
		accentDarker: '#14532D',
		primaryLighter: '#ffc0c0',
		primaryWash: '#ffe7e7',
		primary: '#fd7e4d',
		primaryLight: '#fc9c7e',
		primaryDark: '#b03510',
		primaryDarker: '#732207',

		darkBlend: 'rgba(30, 0, 0, 0.75)',
		lightBlend: 'rgba(255, 250, 250, 0.5)',
		overlay: 'rgba(0, 0, 0, 0.025)',
		...lightmodeGrays,
	},
});
