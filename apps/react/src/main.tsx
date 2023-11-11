import 'virtual:uno.css';
import './darkMode.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { attachToPwaEvents } from './pwaEventListener.js';
import { requestPersistentStorage } from '@/lib/platform.js';

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
requestPersistentStorage();

function debugUno() {
	setTimeout(
		() =>
			navigator.clipboard.writeText(
				document.querySelector('[data-vite-dev-id="/__uno.css"]')
					?.textContent ?? 'failed to copy',
			),
		3000,
	);
}
(window as any).debugUno = debugUno;
