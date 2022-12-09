import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from '@aglio/trpc';
import * as deployedContext from '../config/deployedContext.js';

export const middleware = trpcExpress.createExpressMiddleware({
	router: appRouter,
	createContext: (opts) =>
		createContext({
			...opts,
			deployedContext: {
				apiHost: deployedContext.DEPLOYED_HOST,
				uiHost: deployedContext.UI_ORIGIN,
			},
		}),
});
