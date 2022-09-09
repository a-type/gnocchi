import * as trpcExpress from '@trpc/server/adapters/express/dist/trpc-server-adapters-express.cjs.js';
import * as z from 'zod';
import { createContext, createRouter } from './common.js';
import { invitesRouter } from './invites.js';

const appRouter = createRouter()
	.query('hello', {
		input: z.string().nullish(),
		resolve: ({ input, ctx }) => {
			return `hello ${input ?? ctx.session?.name ?? 'world'}`;
		},
	})
	.merge('invites.', invitesRouter);

export const middleware = trpcExpress.createExpressMiddleware({
	router: appRouter,
	createContext,
});
