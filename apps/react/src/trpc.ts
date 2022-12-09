import { createTRPCReact, httpBatchLink, TRPCClient } from '@trpc/react-query';
import type { AppRouter } from '@aglio/trpc';
import { API_HOST_HTTP } from './config.js';
import type { inferRouterOutputs, inferRouterInputs } from '@trpc/server';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient: TRPCClient<AppRouter> = trpc.createClient({
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
	transformer: superjson,
});

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
