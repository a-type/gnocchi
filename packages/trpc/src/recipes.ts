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
			) as {
				title: string;
				ingredients: {
					id: string;
					text: string;
					unit: string | null;
					quantity: number;
					comments: string[];
					food: string;
				}[];
				instructions: {
					type: string;
					content: {
						id: string;
						type: 'step' | 'sectionTitle';
						content: {
							type: string;
							text?: string;
						}[];
						attrs: {
							id: string;
						};
					}[];
				};
			};

			if (!snapshot) {
				throw new TRPCError({
					message: 'Recipe not found',
					code: 'NOT_FOUND',
				});
			}

			const ingredients = snapshot.ingredients.map((i) => ({
				id: i.id,
				text: i.text,
				unit: i.unit,
				quantity: i.quantity,
				food: i.food,
				comments: JSON.stringify(i.comments),
			}));
			const instructions = snapshot.instructions.content.map((i) => ({
				id: i.attrs.id,
				type: i.type,
				content: i.content?.reduce((text, i) => text + i.text ?? '', '') ?? '',
			}));

			const saved = await prisma.publishedRecipe.upsert({
				where: {
					recipeId_libraryId: {
						recipeId: input.recipeId,
						libraryId,
					},
				},
				update: {
					publishedAt: new Date(),
					title: snapshot.title,
				},
				create: {
					recipeId: input.recipeId,
					libraryId,
					title: snapshot.title,
					publisherId: ctx.session.userId,
					slug: cuid.slug(),
				},
				include: {
					ingredients: true,
					instructions: true,
				},
			});

			const instructonsToDelete = saved.instructions
				.filter((i) => !instructions.some((i2) => i2.id === i.id))
				.map((i) => i.id);
			const ingredientsToDelete = saved.ingredients
				.filter((i) => !ingredients.some((i2) => i2.id === i.id))
				.map((i) => i.id);

			await prisma.$transaction([
				...ingredients.map((i, index) =>
					prisma.publishedRecipeIngredient.upsert({
						where: { id: i.id },
						update: {
							...i,
							index,
						},
						create: {
							...i,
							publishedRecipeId: saved.id,
							index,
						},
					}),
				),
				...instructions.map((i, index) =>
					prisma.publishedRecipeInstruction.upsert({
						where: { id: i.id },
						update: {
							...i,
							index,
						},
						create: {
							...i,
							publishedRecipeId: saved.id,
							index,
						},
					}),
				),
				...instructonsToDelete.map((i) =>
					prisma.publishedRecipeInstruction.delete({
						where: { id: i },
					}),
				),
				...ingredientsToDelete.map((i) =>
					prisma.publishedRecipeIngredient.delete({
						where: { id: i },
					}),
				),
			]);

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
