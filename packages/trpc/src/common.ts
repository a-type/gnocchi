import * as trpcExpress from '@trpc/server/adapters/express/dist/trpc-server-adapters-express.cjs.js';
import { getLoginSession } from '@aglio/auth';
import * as trpc from '@trpc/server';

export const createContext = async ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	const session = await getLoginSession(req);

	return {
		req,
		res,
		session,
	};
};
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
	return trpc.router<Context>();
}
