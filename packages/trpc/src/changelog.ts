import { prisma } from '@aglio/prisma';
import { RequestError } from '@aglio/tools';
import { t } from './common.js';
import { z } from 'zod';

export const changelogRouter = t.router({
	addChangelog: t.procedure
		.input(
			z.object({
				title: z.string(),
				details: z.string(),
				imageUrl: z.string().nullable().optional(),
				important: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			await prisma.changelogItem.create({
				data: {
					...input,
				},
			});
		}),

	deleteChangelog: t.procedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			await prisma.changelogItem.delete({
				where: {
					id: input.id,
				},
			});
		}),

	updateChangelog: t.procedure
		.input(
			z.object({
				id: z.string(),
				title: z.string(),
				details: z.string(),
				imageUrl: z.string().nullable().optional(),
				important: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.isProductAdmin) {
				throw new RequestError(403, 'Not authorized');
			}
			await prisma.changelogItem.update({
				where: {
					id: input.id,
				},
				data: {
					...input,
				},
			});
		}),

	getChangelogs: t.procedure
		.input(
			z.object({
				limit: z.number().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			const changelogs = await prisma.changelogItem.findMany({
				orderBy: {
					createdAt: 'desc',
				},
				take: input.limit || 10,
			});
			return changelogs;
		}),
});
