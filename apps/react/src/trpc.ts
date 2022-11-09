import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '@aglio/trpc';
import { API_HOST_HTTP } from './config.js';

export const trpc = createReactQueryHooks<AppRouter>();

export const trpcClient = trpc.createClient({
	url: `${API_HOST_HTTP}/trpc`,
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: 'include',
		});
	},
});
