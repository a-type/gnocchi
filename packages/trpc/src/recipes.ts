import { getRecipesLibraryName } from '@aglio/tools';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from './common.js';

export const recipesRouter = t.router({
	presence: t.procedure.query(async ({ ctx }) => {
		if (!ctx.session) {
			throw new TRPCError({
				message: 'Not logged in',
				code: 'UNAUTHORIZED',
			});
		}

		const presences = ctx.lofi.getLibraryPresence(
			getRecipesLibraryName(ctx.session.planId),
		);

		return presences;
	}),
});
