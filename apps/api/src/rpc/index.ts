import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from '@aglio/trpc';
import * as deployedContext from '../config/deployedContext.js';
import { Server } from '@verdant-web/server';

export const createTrpcMiddleware = (lofi: Server) =>
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext: (opts) =>
			createContext({
				...opts,
				deployedContext: {
					apiHost: deployedContext.DEPLOYED_HOST,
					uiHost: deployedContext.UI_ORIGIN,
					hubHost: deployedContext.HUB_ORIGIN,
				},
				lofi,
			}),
	});
