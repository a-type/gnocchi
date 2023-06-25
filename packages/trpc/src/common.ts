import { getLoginSession, Session } from '@aglio/auth';
import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { Server } from '@verdant-web/server';
import { getIsHubAuthorizedRequest } from '@aglio/tools';
import type { AISuggestions } from '@aglio/ai';

type Context = {
	req: Request;
	res: Response;
	deployedContext: {
		apiHost: string;
		uiHost: string;
		hubHost: string;
	};
	session: Session | null;
	isProductAdmin: boolean;
	lofi: Server;
	/**
	 * This is an authenticated request from the hub service
	 */
	isHubRequest: boolean;
	ai: AISuggestions;
};

export const createContext = async ({
	req,
	res,
	deployedContext,
	lofi,
	ai,
}: trpcExpress.CreateExpressContextOptions & {
	deployedContext: {
		apiHost: string;
		uiHost: string;
		hubHost: string;
	};
	lofi: Server;
	ai: AISuggestions;
}) => {
	const session = await getLoginSession(req);
	const isHubRequest = getIsHubAuthorizedRequest(req.headers);

	return {
		req,
		res,
		deployedContext,
		session,
		isProductAdmin: session?.isProductAdmin ?? false,
		lofi,
		isHubRequest,
		ai,
	};
};

export const t = initTRPC.context<Context>().create({
	// transformer: superjson,
	errorFormatter({ shape }) {
		console.error(shape);
		return shape;
	},
});
