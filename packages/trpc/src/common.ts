import { getLoginSession, Session } from '@aglio/auth';
import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import superjson from 'superjson';
import * as trpcExpress from '@trpc/server/adapters/express';
import { Server } from '@lo-fi/server';

type Context = {
	req: Request;
	res: Response;
	deployedContext: {
		apiHost: string;
		uiHost: string;
	};
	session: Session | null;
	isProductAdmin: boolean;
	lofi: Server;
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
	};
	lofi: Server;
}) => {
	const session = await getLoginSession(req);

	return {
		req,
		res,
		deployedContext,
		session,
		isProductAdmin: session?.isProductAdmin ?? false,
		lofi,
	};
};

export const t = initTRPC.context<Context>().create({
	// transformer: superjson,
	errorFormatter({ shape }) {
		console.error(shape);
		return shape;
	},
});
