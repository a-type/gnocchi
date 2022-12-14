import { prisma } from '@aglio/prisma';
import { z } from 'zod';
import { t } from './common.js';

export const featureFlagsRouter = t.router({
	getValue: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
		if (!ctx.session) return false;
		const plan = await prisma.plan.findUnique({
			where: {
				id: ctx.session.planId,
			},
		});
		try {
			const flags = JSON.parse(plan?.featureFlags || '{}');
			return !!flags[input];
		} catch (err) {
			return false;
		}
	}),
});
