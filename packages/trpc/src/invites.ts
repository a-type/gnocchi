import { t } from './common.js';
import * as z from 'zod';
import { prisma } from '@aglio/prisma';
import { TRPCError } from '@trpc/server';

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
});
