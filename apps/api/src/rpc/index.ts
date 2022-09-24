import * as trpcExpress from '@trpc/server/adapters/express/dist/trpc-server-adapters-express.cjs.js';
import { appRouter, createContext } from '@aglio/trpc';

export const middleware = trpcExpress.createExpressMiddleware({
	router: appRouter,
	createContext,
});
