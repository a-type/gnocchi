import { getLoginSession, Session } from '@aglio/auth';
import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import superjson from 'superjson';
import * as trpcExpress from '@trpc/server/adapters/express';

type Context = {
	req: Request;
	res: Response;
	deployedContext: {
		apiHost: string;
		uiHost: string;
	};
	session: Session | null;
	isProductAdmin: boolean;
};

export const createContext = async ({
	req,
	res,
	deployedContext,
}: trpcExpress.CreateExpressContextOptions & {
	deployedContext: {
		apiHost: string;
		uiHost: string;
	};
}) => {
	const session = await getLoginSession(req);

	return {
		req,
		res,
		deployedContext,
		session,
		isProductAdmin: session?.isProductAdmin ?? false,
	};
};

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
});
