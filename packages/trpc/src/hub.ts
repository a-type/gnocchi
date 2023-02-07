import { prisma } from '@aglio/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from './common.js';

export const hubRouter = t.router({
	allPublishedSlugs: t.procedure.query(async ({ ctx }) => {
		if (!ctx.isHubRequest) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			});
		}

		const publishedRecipes = await prisma.publishedRecipe.findMany({
			where: {
				unpublishedAt: null,
			},
			select: {
				slug: true,
			},
		});

		return publishedRecipes.map((r) => r.slug);
	}),
	recipeRenderData: t.procedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!ctx.isHubRequest) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			}

			const publishedRecipe = await prisma.publishedRecipe.findUnique({
				where: {
					slug: input.slug,
				},
			});

			if (!publishedRecipe) {
				return null;
			}

			return {
				publishedAt: publishedRecipe.publishedAt,
				slug: publishedRecipe.slug,
				snapshot: publishedRecipe.snapshot
					? JSON.parse(publishedRecipe.snapshot)
					: null,
			};
		}),
});
