import { globalCss } from '@/stitches.config.js';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { attachToPwaEvents } from './pwaEventListener.js';
import { register } from './serviceWorkerRegistration.js';

globalCss({
	'html, body': {
		margin: 0,
		padding: 0,
		fontFamily: '$sans',
		fontSize: '18px',
		height: '100%',
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
	},
})();

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);

	attachToPwaEvents();
}

main();

register();
