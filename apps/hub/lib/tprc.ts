// @filename: client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@aglio/trpc';
// Notice the <AppRouter> generic here.
export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${process.env.API_HOST}/trpc`,
			headers: {
				Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
			},
		}),
	],
});
