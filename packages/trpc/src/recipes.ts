import { prisma } from '@aglio/prisma';
import { getGroceryLibraryName } from '@aglio/tools';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from './common.js';
import cuid from 'cuid';

export const recipesRouter = t.router({
	publish: t.procedure
		.input(
			z.object({
				recipeId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.session) {
				throw new TRPCError({
					message: 'Not logged in',
					code: 'UNAUTHORIZED',
				});
			}

			const libraryId = getGroceryLibraryName(ctx.session.planId);

			const snapshot = ctx.lofi.getDocumentSnapshot(
				libraryId,
				'recipes',
				input.recipeId,
			);

			if (!snapshot) {
				throw new TRPCError({
					message: 'Recipe not found',
					code: 'NOT_FOUND',
				});
			}

			const serializedSnapshot = JSON.stringify(snapshot);

			const saved = await prisma.publishedRecipe.upsert({
				where: {
					recipeId_libraryId: {
						recipeId: input.recipeId,
						libraryId,
					},
				},
				update: {
					snapshot: serializedSnapshot,
				},
				create: {
					recipeId: input.recipeId,
					libraryId,
					snapshot: serializedSnapshot,
					publisherId: ctx.session.userId,
					slug: cuid.slug(),
				},
			});

			// revalidate the hub page
			fetch(`${ctx.deployedContext.hubHost}/api/revalidate`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.HUB_TOKEN}`,
				},
				body: JSON.stringify({
					slug: saved.slug,
				}),
			});
		}),

	unpublish: t.procedure
		.input(
			z.object({
				recipeId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.session) {
				throw new TRPCError({
					message: 'Not logged in',
					code: 'UNAUTHORIZED',
				});
			}

			const libraryId = getGroceryLibraryName(ctx.session.planId);

			await prisma.publishedRecipe.update({
				where: {
					recipeId_libraryId: {
						recipeId: input.recipeId,
						libraryId,
					},
				},
				data: {
					unpublishedAt: new Date(),
				},
			});
		}),

	publishedInfo: t.procedure
		.input(
			z.object({
				recipeId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (!ctx.session) {
				throw new TRPCError({
					message: 'Not logged in',
					code: 'UNAUTHORIZED',
				});
			}

			const libraryId = getGroceryLibraryName(ctx.session.planId);

			const publishedRecipe = await prisma.publishedRecipe.findFirst({
				where: {
					recipeId: input.recipeId,
					libraryId,
					unpublishedAt: null,
				},
			});

			if (!publishedRecipe || publishedRecipe.unpublishedAt) {
				return null;
			}

			return {
				publishedAt: publishedRecipe.publishedAt,
				slug: publishedRecipe.slug,
			};
		}),
});
