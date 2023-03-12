import { t } from './common.js';
import * as z from 'zod';
import { prisma } from '@aglio/prisma';
import { TRPCError } from '@trpc/server';
import cuid from 'cuid';
import { setLoginSession, setTemporaryAccessSession } from '@aglio/auth';

export const invitesRouter = t.router({
	details: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
		const invite = await prisma.planInvitation.findUnique({
			where: {
				id: input,
			},
		});

		if (!invite) {
			throw new TRPCError({
				message: "Couldn't find that invite",
				code: 'NOT_FOUND',
			});
		}

		return {
			inviterName: invite.inviterName,
		};
	}),
	createTemporary: t.procedure.mutation(async ({ ctx }) => {
		if (!ctx.session) {
			throw new TRPCError({
				message: 'Unauthorized',
				code: 'UNAUTHORIZED',
			});
		}

		const invite = await prisma.temporaryAccess.create({
			data: {
				code: cuid.slug(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
				planId: ctx.session.planId,
			},
		});

		return {
			url: `${ctx.deployedContext.uiHost}/temp/${invite.code}`,
		};
	}),
	claimTemporary: t.procedure
		.input(
			z.object({
				code: z.string(),
				name: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const invite = await prisma.temporaryAccess.findUnique({
				where: {
					code: input.code,
				},
			});

			if (!invite) {
				throw new TRPCError({
					message: "Couldn't find that invite",
					code: 'NOT_FOUND',
				});
			}

			if (invite.expiresAt < new Date()) {
				throw new TRPCError({
					message: 'This invite has expired',
					code: 'BAD_REQUEST',
				});
			}

			if (invite.claimedAt) {
				throw new TRPCError({
					message: 'This invite has already been claimed',
					code: 'BAD_REQUEST',
				});
			}

			await prisma.temporaryAccess.update({
				where: {
					id: invite.id,
				},
				data: {
					claimedAt: new Date(),
					name: input.name,
				},
			});

			await setTemporaryAccessSession(ctx.res, {
				planId: invite.planId,
				name: input.name,
				temporaryAccessId: invite.id,
			});

			return {
				success: true,
			};
		}),

	temporaryAccessDetails: t.procedure
		.input(
			z.object({
				code: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const access = await prisma.temporaryAccess.findUnique({
				where: { code: input.code },
				select: {
					name: true,
					expiresAt: true,
					plan: {
						select: {
							members: {
								select: {
									friendlyName: true,
								},
								where: {
									role: 'admin',
								},
								take: 1,
							},
						},
					},
				},
			});

			if (!access) {
				throw new TRPCError({
					message: 'Invite not found',
					code: 'NOT_FOUND',
				});
			}

			const planOwnerName = access.plan.members[0]?.friendlyName ?? '';
			const listName = planOwnerName
				? `${planOwnerName}'s list`
				: `Grocery list`;

			return {
				name: access.name,
				expiresAt: access.expiresAt,
				listName,
			};
		}),
});
