import { setLoginSession } from '@aglio/auth';
import { prisma } from '@aglio/prisma';
import { RequestError } from '@aglio/tools';
import * as z from 'zod';
import { t } from './common.js';

export const planRouter = t.router({
	kick: t.procedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session) {
				throw new RequestError(401, 'Unauthorized');
			}

			if (ctx.session.role !== 'admin') {
				throw new RequestError(403, 'Forbidden');
			}

			// the current user must be the plan admin
			const plan = await prisma.plan.findUnique({
				where: {
					id: ctx.session.planId,
				},
			});

			if (!plan) {
				throw new RequestError(404, 'Plan not found');
			}

			const kicked = await prisma.profile.findUnique({
				where: {
					id: input.id,
				},
			});

			if (kicked?.planId !== plan.id) {
				throw new RequestError(404, 'Profile not found on this plan');
			}

			// the kicked user needs a new plan
			await prisma.profile.update({
				where: {
					id: kicked.id,
				},
				data: {
					// they become the admin of their new plan
					role: 'admin',
					plan: {
						create: {},
					},
				},
			});

			await prisma.activityLog.create({
				data: {
					profileId: ctx.session.userId,
					action: 'kick',
					data: JSON.stringify({
						kickedId: kicked.id,
						planId: plan.id,
					}),
				},
			});
		}),
	members: t.procedure.query(async ({ ctx }) => {
		if (!ctx.session) {
			throw new RequestError(401, 'Unauthorized');
		}

		const plan = await prisma.plan.findUnique({
			where: {
				id: ctx.session.planId,
			},
		});

		if (!plan) {
			throw new RequestError(404, 'Plan not found');
		}

		const members = await prisma.profile.findMany({
			where: {
				planId: plan.id,
			},
		});

		return members.map((profile) => ({
			id: profile.id,
			fullName: profile.fullName,
			email: profile.email,
			imageUrl: profile.imageUrl,
		}));
	}),
	leave: t.procedure.mutation(async ({ ctx }) => {
		if (!ctx.session) {
			throw new RequestError(401, 'Unauthorized');
		}

		if (ctx.session.role === 'admin') {
			throw new RequestError(
				403,
				'Admins cannot leave plans. Cancel your subscription instead.',
			);
		}

		// the current user must be the plan admin
		const plan = await prisma.plan.findUnique({
			where: {
				id: ctx.session.planId,
			},
		});

		if (!plan) {
			throw new RequestError(404, 'Plan not found');
		}

		// the leaving user needs a new plan
		const newPlan = await prisma.plan.create({
			data: {},
		});
		await prisma.profile.update({
			where: {
				id: ctx.session.userId,
			},
			data: {
				// they become the admin of their new plan
				role: 'admin',
				planId: newPlan.id,
			},
		});

		await prisma.activityLog.create({
			data: {
				profileId: ctx.session.userId,
				action: 'leave',
				data: JSON.stringify({
					planId: plan.id,
				}),
			},
		});

		// update the session
		await setLoginSession(ctx.res, {
			userId: ctx.session.userId,
			planId: newPlan.id,
			name: ctx.session.name,
			role: ctx.session.role,
			isProductAdmin: ctx.session.isProductAdmin,
		});
	}),
});
