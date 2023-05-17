import { addItems, groceriesDescriptor } from '@/stores/groceries/index.js';
import { recipeSavePromptState } from './components/recipes/savePrompt/state.js';

export function attachToPwaEvents() {
	if (typeof window === 'undefined') return;
	if (typeof navigator === 'undefined') return;
	if (!navigator.serviceWorker) return;
	navigator.serviceWorker.addEventListener('message', async (event) => {
		if (event.data.type === 'pwa-share') {
			const items = event.data.items as string[] | undefined;
			if (items) {
				const client = await groceriesDescriptor.open();
				await addItems(client, items, {
					sourceInfo: { title: 'Shared list' },
				});
				console.log('Added shared items to list');
			} else if (event.data.url) {
				const url = event.data.url as string;
				recipeSavePromptState.url = url;
			} else {
				// must be something else... nothing for now
				console.debug('Got PWA share:', event.data);
			}
		}
	});
	navigator.serviceWorker.controller?.postMessage({ type: 'share-ready' });
}
