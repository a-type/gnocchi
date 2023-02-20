import { prisma } from '@aglio/prisma';
import { BuildProcedure, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from './common.js';
import { urlify } from '@aglio/tools';

export const hubRouter = t.router({
	allPublishedSlugs: t.procedure.query(async ({ ctx }) => {
		if (!ctx.isHubRequest) {
			throw new TRPCError({
				code: 'NOT_FOUND',
			});
		}

		const publishedRecipes = await prisma.publishedRecipe.findMany({
			where: {
				unpublishedAt: null,
			},
			select: {
				slug: true,
				title: true,
			},
		});

		return publishedRecipes.map((r) => `${urlify(r.title)}-${r.slug}`);
	}),
	recipeRenderData: t.procedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!ctx.isHubRequest) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			}

			const publishedRecipe = await prisma.publishedRecipe.findUnique({
				where: {
					slug: input.slug,
				},
				select: {
					id: true,
					publishedAt: true,
					publisher: {
						select: {
							id: true,
							fullName: true,
						},
					},
					slug: true,
					title: true,
					version: true,
					ingredients: {
						select: {
							id: true,
							text: true,
							note: true,
						},
					},
					instructions: {
						select: {
							id: true,
							type: true,
							content: true,
							note: true,
						},
					},
					preludeSerialized: true,
				},
			});

			if (!publishedRecipe) {
				return null;
			}

			const { preludeSerialized, ...rest } = publishedRecipe;
			const formattedRecipe = {
				prelude: preludeSerialized
					? (JSON.parse(preludeSerialized) as PreludeShape)
					: null,
				...rest,
			};

			return formattedRecipe;
		}),
});

type PreludeShape = {
	type: string;
	content: PreludeNode[];
	attrs?: {
		[key: string]: any;
	};
};
type PreludeNode =
	| {
			type: 'paragraph';
			content: [
				{
					type: 'text';
					text: string;
				},
			];
	  }
	| {
			type: 'heading';
			attrs: { level: number };
			content: [
				{
					type: 'text';
					text: string;
				},
			];
	  };
export type HubPublishedRecipeInfo = Exclude<
	typeof hubRouter.recipeRenderData extends BuildProcedure<any, any, infer C>
		? C
		: never,
	null
>;