import { createRouter } from './common.js';
import * as z from 'zod';
import { scanWebRecipe } from '@aglio/scanning';
import { isSubscribed } from '@aglio/auth';
import { TRPCError } from '@trpc/server';

export const scansRouter = createRouter().query('recipe', {
	input: z.object({
		url: z.string(),
	}),
	resolve: async ({ ctx, input: { url } }) => {
		const ok = await isSubscribed(ctx.session);
		if (!ok) {
			throw new TRPCError({
				code: 'FORBIDDEN',
			});
		}
		const result = await scanWebRecipe(url);
		return result;
	},
});
