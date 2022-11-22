import { globalCss } from '@/stitches.config.js';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { attachToPwaEvents } from './pwaEventListener.js';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

globalCss({
	'@font-face': [
		{
			fontFamily: 'Domine',
			src: `url('/fonts/Domine-VariableFont_wght.ttf')`,
		},
		{
			fontFamily: 'Inter',
			src: `url('/fonts/Inter-VariableFont_slnt,wght.ttf')`,
		},
		{
			fontFamily: 'Londrina Outline',
			src: `url('/fonts/LondrinaOutline-Regular.ttf')`,
		},
		{
			fontFamily: 'Libre Baskerville',
			src: `url('/fonts/LibreBaskerville-Regular.ttf')`,
		},
	],

	'html, body': {
		margin: 0,
		padding: 0,
		fontFamily: '$sans',
		fontSize: '18px',
		height: '100%',
		'-webkit-font-smoothing': 'antialiased',
	},

	body: {
		height: '100%',
		backgroundColor: '$light',
	},

	'#root': {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100%',
	},

	a: {
		color: 'inherit',
		textDecoration: 'none',
	},

	'*': {
		boxSizing: 'border-box',
		'-webkit-tap-highlight-color': 'transparent',
	},
})();

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}

main();

registerSW({
	onNeedRefresh() {
		alert('New content is available; please refresh.');
	},
	onOfflineReady() {
		console.log('Offline ready');
	},
	onRegistered(r: any) {
		r &&
			setInterval(() => {
				r.update();
			}, 60 * 60 * 1000);
	},
});

attachToPwaEvents();
