import '@aglio/ui/styles';
import './main.css.js';
import './darkMode.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { attachToPwaEvents } from './pwaEventListener.js';

if (!import.meta.env.DEV) {
	import('@vercel/analytics').then((mod) => {
		mod.inject();
	});
}

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
