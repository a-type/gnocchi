import * as z from 'zod';
import { categoriesRouter } from './categories.js';
import { createRouter } from './common.js';
import { invitesRouter } from './invites.js';
import { scansRouter } from './scans.js';

export const appRouter = createRouter()
	.query('hello', {
		input: z.string().nullish(),
		resolve: ({ input, ctx }) => {
			return `hello ${input ?? ctx.session?.name ?? 'world'}`;
		},
	})
	.merge('invites.', invitesRouter)
	.merge('categories.', categoriesRouter)
	.merge('scans.', scansRouter);

export type AppRouter = typeof appRouter;

export { createContext } from './common.js';
