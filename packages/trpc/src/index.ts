import * as z from 'zod';
import { createRouter } from './common.js';
import { invitesRouter } from './invites.js';

export const appRouter = createRouter()
	.query('hello', {
		input: z.string().nullish(),
		resolve: ({ input, ctx }) => {
			return `hello ${input ?? ctx.session?.name ?? 'world'}`;
		},
	})
	.merge('invites.', invitesRouter);

export type AppRouter = typeof appRouter;
