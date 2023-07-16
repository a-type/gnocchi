import { t } from './common.js';
import * as z from 'zod';
import { scanWebRecipe, ScanForbiddenError } from '@aglio/scanning';
import { isSubscribed } from '@aglio/auth';
import { TRPCError } from '@trpc/server';
import { prisma } from '@aglio/prisma';

export const scansRouter = t.router({
	recipe: t.procedure
		.input(
			z.object({
				url: z.string(),
			}),
		)
		.query(async ({ ctx, input: { url } }) => {
			if (url.startsWith(ctx.deployedContext.hubHost)) {
				const slugBase = url.split('/').pop();
				if (!slugBase) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Invalid recipe URL',
					});
				}
				const slug = slugBase.split('-').pop();
				const recipe = await prisma.publishedRecipe.findUnique({
					where: { slug },
					include: {
						ingredients: true,
					},
				});
				if (!recipe) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Recipe not found',
					});
				}
				return {
					type: 'hub',
					data: recipe,
					url,
				} as const;
			} else {
				const ok = await isSubscribed(ctx.session);
				if (!ok) {
					throw new TRPCError({
						code: 'UNAUTHORIZED',
					});
				}
				try {
					const result = await scanWebRecipe(url);
					return {
						type: 'web',
						data: result,
					} as const;
				} catch (e) {
					if (e instanceof ScanForbiddenError) {
						throw new TRPCError({
							code: 'FORBIDDEN',
							message: e.message,
						});
					}
					throw e;
				}
			}
		}),
});
