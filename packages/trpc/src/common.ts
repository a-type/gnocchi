import { getLoginSession, Session } from '@aglio/auth';
import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { Server } from '@lo-fi/server';
import { getIsHubAuthorizedRequest } from '@aglio/tools';

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
};

export const createContext = async ({
	req,
	res,
	deployedContext,
	lofi,
}: trpcExpress.CreateExpressContextOptions & {
	deployedContext: {
		apiHost: string;
		uiHost: string;
		hubHost: string;
	};
	lofi: Server;
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
	};
};

export const t = initTRPC.context<Context>().create({
	// transformer: superjson,
	errorFormatter({ shape }) {
		console.error(shape);
		return shape;
	},
});
