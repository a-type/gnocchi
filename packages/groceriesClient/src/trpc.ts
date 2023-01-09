import { httpBatchLink, createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from '@aglio/trpc';
import { API_HOST_HTTP } from './config.js';
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';

export const trpcClientOptions = {
	links: [
		httpBatchLink({
			url: `${API_HOST_HTTP}/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				});
			},
		}),
	],
};

export const trpcClient = createTRPCProxyClient<AppRouter>(trpcClientOptions);

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
