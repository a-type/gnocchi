import { createRouter } from './common.js';
import * as z from 'zod';
import { prisma } from '@aglio/prisma';
import { TRPCError } from '@trpc/server';

export const invitesRouter = createRouter().query('details', {
	input: z.string(),
	resolve: async ({ ctx, input }) => {
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
	},
});
