import { prisma } from '@aglio/prisma';
import { z } from 'zod';
import { t } from './common.js';

export const adminRouter = t.router({
	plans: t.procedure.query(async ({ ctx }) => {
		if (!ctx.isProductAdmin) {
			throw new Error('Not authorized');
		}
		// TODO: pagination
		const allPlans = await prisma.plan.findMany({
			include: {
				members: {
					select: {
						email: true,
						fullName: true,
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
				throw new Error('Not authorized');
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
});