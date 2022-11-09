import { createRouter } from './common.js';
import * as z from 'zod';
import { prisma } from '@aglio/prisma';

export const categoriesRouter = createRouter()
	.query('defaults', {
		resolve: async ({ ctx }) => {
			const categories = await prisma.defaultCategory.findMany({
				orderBy: {
					sortKey: 'asc',
				},
			});
			return categories;
		},
	})
	.query('assignment', {
		input: z.string(),
		resolve: async ({ input }) => {
			const assignment = await prisma.defaultFoodCategoryAssignment.findFirst({
				where: {
					foodName: input,
				},
				orderBy: {
					votes: 'desc',
				},
			});
			return assignment?.categoryId;
		},
	})
	.mutation('assign', {
		input: z.object({
			foodName: z.string(),
			categoryId: z.string(),
		}),
		resolve: async ({ input }) => {
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
		},
	})
	.query('assignments', {
		resolve: async () => {
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
		},
	})
	.mutation('updateDefault', {
		input: z.object({
			id: z.string(),
			name: z.string().optional(),
			sortKey: z.string().optional(),
		}),
		resolve: async ({ input }) => {
			const category = await prisma.defaultCategory.update({
				where: { id: input.id },
				data: {
					name: input.name,
					sortKey: input.sortKey,
				},
			});
			return category;
		},
	})
	.mutation('createDefault', {
		input: z.object({
			name: z.string(),
			sortKey: z.string(),
		}),
		resolve: async ({ input }) => {
			const category = await prisma.defaultCategory.create({
				data: {
					name: input.name,
					sortKey: input.sortKey,
				},
			});
			return category;
		},
	})
	.mutation('deleteDefault', {
		input: z.string(),
		resolve: async ({ input }) => {
			const category = await prisma.defaultCategory.delete({
				where: { id: input },
			});
			return category;
		},
	});
