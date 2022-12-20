import './styles/reset.css.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { attachToPwaEvents } from './pwaEventListener.js';
import './styles/global.css.js';

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
