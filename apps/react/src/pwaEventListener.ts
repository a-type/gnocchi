import { groceries } from './stores/groceries/index.js';

export function attachToPwaEvents() {
	if (typeof window === 'undefined') return;
	window.addEventListener('message', async (event) => {
		if (event.data.type === 'pwa-share') {
			const items = event.data.items as string[] | undefined;
			if (items) {
				await groceries.addItems(items);
				console.log('Added shared items to list');
			} else {
				// must be something else... nothing for now
				console.debug('Got PWA share:', event.data);
			}
		}
	});
}
