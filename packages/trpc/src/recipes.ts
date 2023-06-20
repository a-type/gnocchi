import { prisma } from '@aglio/prisma';
import { getGroceryLibraryName, urlify } from '@aglio/tools';
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
				prepTimeMinutes: number | null;
				cookTimeMinutes: number | null;
				totalTimeMinutes: number | null;
				ingredients: {
					id: string;
					text: string;
					unit: string | null;
					quantity: number;
					comments: string[];
					food: string;
					note: string | null;
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
						attrs?: {
							id: string;
							note?: string | null;
						};
					}[];
				};
				prelude: {
					type: string;
					content: {
						type: string;
					}[];
					attrs?: {
						[key: string]: any;
					};
				};
				mainImage?: {
					id: string;
					name: string;
					type: string;
					url: string | null;
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
				note: i.note,
			}));
			const instructions = snapshot.instructions;
			const preludeSerialized = snapshot.prelude?.content?.length
				? JSON.stringify(snapshot.prelude)
				: null;

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
					preludeSerialized,
					unpublishedAt: null,
					mainImageUrl: snapshot.mainImage?.url ?? null,
					instructionsSerialized: JSON.stringify(instructions),
					prepTimeMinutes: snapshot.prepTimeMinutes,
					cookTimeMinutes: snapshot.cookTimeMinutes,
					totalTimeMinutes: snapshot.totalTimeMinutes,
				},
				create: {
					recipeId: input.recipeId,
					libraryId,
					title: snapshot.title,
					publisherId: ctx.session.userId,
					slug: cuid.slug(),
					preludeSerialized,
					mainImageUrl: snapshot.mainImage?.url ?? null,
					instructionsSerialized: JSON.stringify(instructions),
					prepTimeMinutes: snapshot.prepTimeMinutes,
					cookTimeMinutes: snapshot.cookTimeMinutes,
					totalTimeMinutes: snapshot.totalTimeMinutes,
				},
				include: {
					ingredients: true,
				},
			});

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
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					publisherId: saved.publisherId,
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
				url: `${ctx.deployedContext.hubHost}/${
					publishedRecipe.publisherId
				}/${urlify(publishedRecipe.title)}-${publishedRecipe.slug}`,
			};
		}),
});
