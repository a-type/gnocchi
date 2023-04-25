import { prisma } from '@aglio/prisma';
import {
	getGroceryLibraryName,
	getRecipesLibraryName,
	RequestError,
} from '@aglio/tools';
import { z } from 'zod';
import { t } from './common.js';

export const adminRouter = t.router({
	plans: t.procedure.query(async ({ ctx }) => {
		if (!ctx.isProductAdmin) {
			throw new RequestError(403, 'Not authorized');
		}
		// TODO: pagination
		const allPlans = await prisma.plan.findMany({
			include: {
				members: {
					select: {
						email: true,
						fullName: true,
						role: true,
						id: true,
					},
				},
			},
		});
		return allPlans;
	}),
	updateFeatureFlags: t.procedure
		.input(
			z.object({
				planId: z.string(),
				featureFlags: z.record(z.string(), z.boolean()),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const { planId, featureFlags } = input;
			const plan = await prisma.plan.update({
				where: {
					id: planId,
				},
				data: {
					featureFlags: {
						set: JSON.stringify(featureFlags),
					},
				},
			});
			return plan;
		}),
	resetSync: t.procedure
		.input(
			z.object({
				planId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			ctx.lofi.evictLibrary(getGroceryLibraryName(input.planId));
			ctx.lofi.evictLibrary(getRecipesLibraryName(input.planId));
		}),
	updateProfile: t.procedure
		.input(
			z.object({
				profileId: z.string(),
				role: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const { profileId, role } = input;
			const profile = await prisma.profile.update({
				where: {
					id: profileId,
				},
				data: {
					role,
				},
			});
			return {
				success: true,
			};
		}),
	foods: t.procedure
		.input(
			z.object({
				startsWith: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const foods = await prisma.foodData.findMany({
				where: {
					canonicalName: {
						startsWith: input.startsWith,
					},
				},
				include: {
					names: true,
					categoryAssignments: {
						include: {
							category: true,
						},
					},
				},
			});
			return foods;
		}),
	updateFood: t.procedure
		.input(
			z.object({
				foodId: z.string(),
				data: z.object({
					canonicalName: z.string().optional(),
					expiresAfterDays: z.number().nullable().optional(),
					categoryId: z.string().nullable().optional(),
					addNames: z.array(z.string()).optional(),
					removeNames: z.array(z.string()).optional(),
				}),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			const { foodId, data } = input;
			const { addNames, removeNames, categoryId, ...rest } = data;
			const food = await prisma.foodData.update({
				where: {
					id: foodId,
				},
				data: {
					...rest,
					names: {
						upsert: addNames?.map((name) => ({
							where: {
								name,
							},
							create: {
								name,
							},
							update: {},
						})),
						deleteMany: removeNames?.map((name) => ({
							name,
						})),
					},
				},
			});
			// boost selected category assignment
			if (categoryId) {
				await prisma.defaultFoodCategoryAssignment.upsert({
					where: {
						categoryId_foodId: {
							foodId,
							categoryId,
						},
					},
					create: {
						foodId,
						categoryId,
						votes: 1000000,
					},
					update: {
						votes: 1000000,
					},
				});
			}
			return food;
		}),
});
