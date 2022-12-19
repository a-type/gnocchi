import { t } from './common.js';
import * as z from 'zod';
import { scanWebRecipe } from '@aglio/scanning';
import { isSubscribed } from '@aglio/auth';
import { TRPCError } from '@trpc/server';

export const scansRouter = t.router({
	recipe: t.procedure
		.input(
			z.object({
				url: z.string(),
			}),
		)
		.query(async ({ ctx, input: { url } }) => {
			const ok = await isSubscribed(ctx.session);
			if (!ok) {
				throw new TRPCError({
					code: 'FORBIDDEN',
				});
			}
			const result = await scanWebRecipe(url);
			return result;
		}),
});
