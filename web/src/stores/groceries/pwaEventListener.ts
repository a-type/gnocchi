import { Context } from '@aphro/runtime-ts';
import GroceryList from './.generated/GroceryList';
import { addItems } from './mutations';

export function attachToPwaEvents(ctx: Context, list: GroceryList) {
	if (typeof window === 'undefined') return;
	window.addEventListener('message', async (event) => {
		if (event.data.type === 'pwa-share') {
			const items = event.data.items as string[] | undefined;
			if (items) {
				await addItems(ctx, list.id, items);
				console.log('Added shared items to list');
			} else {
				// must be something else... nothing for now
				console.debug('Got PWA share:', event.data);
			}
		}
	});
}
