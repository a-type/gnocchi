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
	assignment: t.procedure.input(z.string()).query(async ({ input }) => {
		const assignment = await prisma.defaultFoodCategoryAssignment.findFirst({
			where: {
				foodName: input,
			},
			orderBy: {
				votes: 'desc',
			},
		});
		return assignment?.categoryId;
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

			const assignment = await prisma.defaultFoodCategoryAssignment.upsert({
				where: {
					categoryId_foodName: {
						foodName: input.foodName,
						categoryId: input.categoryId,
					},
				},
				create: {
					foodName: input.foodName,
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
	assignments: t.procedure.query(async () => {
		// select all assignments with distinct food names and the highest votes
		const assignments: {
			id: string;
			foodName: string;
			categoryId: string;
			votes: any;
		}[] = await prisma.$queryRaw`
				SELECT
					id AS id,
					food_name AS foodName,
					category_id AS categoryId,
					MAX(votes) AS votes
				FROM default_food_category_assignments
				GROUP BY foodName, categoryId
			`;
		return assignments.map(({ votes, ...a }) => a);
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
