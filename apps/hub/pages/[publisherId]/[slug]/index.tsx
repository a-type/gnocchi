import { trpc } from '@/lib/tprc.js';
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import {
	IngredientList,
	IngredientListItem,
} from '@/components/IngredientList.jsx';
import { Instructions } from '@/components/Instructions.jsx';
import { HubPublishedRecipeInfo } from '@aglio/trpc';
import { Prelude } from '@/components/Prelude.jsx';
// @ts-ignore
import Head from 'next/head.js';
import { MainImage } from '@/components/MainImage.jsx';
import { TopLineRoot, TopLineTitle } from '@/components/layout.jsx';
import {
	PageRoot,
	PageContent,
	PageFixedArea,
} from '@aglio/ui/components/layouts';
import { H1, P, H2 } from '@aglio/ui/components/typography';
import { Divider } from '@aglio/ui/components/divider';
import { Note } from '@aglio/ui/components/note';
import { Button } from '@aglio/ui/components/button';

export default function RecipePage({
	data,
	url,
}: {
	data: HubPublishedRecipeInfo | null;
	url: string;
}) {
	if (!data) {
		return (
			<>
				{/* @ts-ignore */}
				<Head>
					<title>Not found</title>
				</Head>
				<PageRoot className="theme-lemon">
					<PageContent>
						<H1>Not found</H1>
					</PageContent>
				</PageRoot>
			</>
		);
	}

	return (
		<>
			{/* @ts-ignore */}
			<Head>
				<title>{data.title}</title>
			</Head>
			<PageRoot className="theme-lemon">
				<PageContent>
					<article
						itemScope
						itemType="https://schema.org/Recipe"
						className="h-recipe"
					>
						<TopLineRoot>
							{data.mainImageUrl && (
								<MainImage url={data.mainImageUrl} title={data.title} />
							)}
							<TopLineTitle>
								<H1 itemProp="name" className="p-name">
									{data.title}
								</H1>
								<P itemProp="author" className="p-author">
									Published by {data.publisher?.fullName ?? 'Anonymous'}
								</P>
							</TopLineTitle>
						</TopLineRoot>
						{data.prelude && (
							<div>
								<Prelude content={data.prelude} />
							</div>
						)}
						<Divider />
						<div className="my-4">
							<H2 className="gutter-bottom">Ingredients</H2>
							<IngredientList>
								{data.ingredients.map((ingredient) => (
									<IngredientListItem key={ingredient.id}>
										<div itemProp="recipeIngredient" className="p-ingredient">
											{ingredient.text}
										</div>
										{ingredient.note && (
											<Note className="ml-4">{ingredient.note}</Note>
										)}
									</IngredientListItem>
								))}
							</IngredientList>
						</div>
						<Divider />
						<div className="mb-12 mt-4">
							<H2 className="gutter-bottom">Instructions</H2>
							<Instructions instructions={data.instructions} />
						</div>
						<PageFixedArea className="flex flex-row justify-end bottom-4 top-auto mb-4 bg-transparent">
							<a
								href={`${
									process.env.NEXT_APP_GROCERIES_HOST
								}?recipeUrl=${encodeURIComponent(
									url,
								)}&hub=true&skipWelcome=true`}
							>
								<Button color="primary" className="shadow-lg">
									Save Recipe
								</Button>
							</a>
						</PageFixedArea>
						<P size="xs" className="color-gray7 ml-auto text-right">
							Powered by{' '}
							<a
								className="font-bold color-black"
								href="https://gnocchi.club/welcome"
							>
								Gnocchi.club
							</a>
							, the freshest way to manage your weekly cooking
						</P>
					</article>
				</PageContent>
			</PageRoot>
		</>
	);
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
	const all = await trpc.hub.allPublishedSlugs.query();
	return {
		paths: all.map((info) => ({
			params: { slug: info.slug, publisherId: info.publisherId },
		})),
		fallback: 'blocking',
	};
}

export async function getStaticProps(
	context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<any>> {
	if (!context.params) throw new Error('No params');
	const slugBase = (context.params.slug as string | undefined) ?? '';
	const slug = slugBase.split('-').pop();
	if (!slug) throw new Error('No slug');
	const data = await trpc.hub.recipeRenderData.query({
		slug,
	});

	return {
		props: {
			data,
			url: `${process.env.HOST}/${slugBase}`,
		},
	};
}
