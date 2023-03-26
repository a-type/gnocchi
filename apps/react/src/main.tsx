import '@aglio/ui';
import './main.css.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { attachToPwaEvents } from './pwaEventListener.js';

import('@vercel/analytics').then((mod) => {
	mod.inject();
});

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}

main();

attachToPwaEvents();
