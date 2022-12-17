import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from '@aglio/trpc';
import * as deployedContext from '../config/deployedContext.js';
import { Server } from '@lo-fi/server';

export const createTrpcMiddleware = (lofi: Server) =>
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: (opts) =>
			createContext({
				...opts,
				deployedContext: {
					apiHost: deployedContext.DEPLOYED_HOST,
					uiHost: deployedContext.UI_ORIGIN,
				},
				lofi,
			}),
	});
