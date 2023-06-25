import { TRPCError } from '@trpc/server';
import { t } from './common.js';
import { z } from 'zod';

export const suggestionsRouter = t.router({
	groceries: t.procedure
		.input(z.array(z.string()))
		.query(async ({ input, ctx }) => {
			if (!ctx.session) {
				throw new TRPCError({
					message: 'Not logged in',
					code: 'UNAUTHORIZED',
				});
			}

			const suggestions = await ctx.ai.suggestGroceryItems(input);
			return {
				suggestions,
			};
		}),
});
