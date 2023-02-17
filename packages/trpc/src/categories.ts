import { t } from './common.js';
import * as z from 'zod';
import { prisma } from '@aglio/prisma';
import { RequestError } from '@aglio/tools';

export const categoriesRouter = t.router({
	defaults: t.procedure.query(async ({ ctx }) => {
		const categories = await prisma.defaultCategory.findMany({
			orderBy: {
				sortKey: 'asc',
			},
		});
		return categories;
	}),
	assign: t.procedure
		.input(
			z.object({
				foodName: z.string(),
				categoryId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			// if not a default category, ignore
			const category = await prisma.defaultCategory.findUnique({
				where: { id: input.categoryId },
			});

			if (!category) {
				return;
			}

			// lookup food by name to see if it exists
			const existingName = await prisma.foodName.upsert({
				where: { name: input.foodName },
				create: {
					name: input.foodName,
					foodData: {
						create: {
							canonicalName: input.foodName,
						},
					},
				},
				update: {},
				include: {
					foodData: true,
				},
			});

			const assignment = await prisma.defaultFoodCategoryAssignment.upsert({
				where: {
					categoryId_foodId: {
						categoryId: input.categoryId,
						foodId: existingName.foodData.id,
					},
				},
				create: {
					foodId: existingName.foodData.id,
					categoryId: input.categoryId,
					votes: 1,
				},
				update: {
					votes: {
						increment: 1,
					},
				},
			});

			return assignment;
		}),
	updateDefault: t.procedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				sortKey: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const category = await prisma.defaultCategory.update({
				where: { id: input.id },
				data: {
					name: input.name,
					sortKey: input.sortKey,
				},
			});
			return category;
		}),
	createDefault: t.procedure
		.input(
			z.object({
				name: z.string(),
				sortKey: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const category = await prisma.defaultCategory.create({
				data: {
					name: input.name,
					sortKey: input.sortKey,
				},
			});
			return category;
		}),
	deleteDefault: t.procedure
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const category = await prisma.defaultCategory.delete({
				where: { id: input },
			});
			return category;
		}),
});
