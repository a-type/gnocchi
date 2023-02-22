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
				publisherId: true,
			},
		});

		return publishedRecipes.map((r) => ({
			slug: r.slug,
			publisherId: r.publisherId,
			title: r.title,
		}));
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
					preludeSerialized: true,
					instructionsSerialized: true,
					mainImageUrl: true,
				},
			});

			if (!publishedRecipe) {
				return null;
			}

			const { preludeSerialized, instructionsSerialized, ...rest } =
				publishedRecipe;
			const formattedRecipe = {
				prelude: preludeSerialized
					? (JSON.parse(preludeSerialized) as PreludeShape)
					: null,
				instructions: instructionsSerialized
					? (JSON.parse(instructionsSerialized) as InstructionsShape)
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

type InstructionsShape = {
	type: string;
	content: InstructionNode[];
	attrs?: {
		[key: string]: any;
	};
};
type InstructionNode =
	| {
			type: 'step';
			content: [
				{
					type: 'text';
					text: string;
				},
			];
			attrs: {
				id: string;
				note?: string | null;
			};
	  }
	| {
			type: 'sectionTitle';
			content: [
				{
					type: 'text';
					text: string;
				},
			];
			attrs: {
				id: string;
			};
	  };

export type HubPublishedRecipeInfo = Exclude<
	typeof hubRouter.recipeRenderData extends BuildProcedure<any, any, infer C>
		? C
		: never,
	null
>;
