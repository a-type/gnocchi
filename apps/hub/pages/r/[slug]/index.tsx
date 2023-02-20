import {
	Checkbox,
	H1,
	H2,
	P,
	lemonTheme,
	PageContent,
	PageRoot,
	sprinkles,
	PageSection,
	Box,
	Note,
	PageFixedArea,
	Button,
} from '@aglio/ui';
import { trpc } from '@/lib/tprc';
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import {
	IngredientList,
	IngredientListItem,
} from '@/components/IngredientList';
import { Instructions } from '@/components/Instructions';
import { HubPublishedRecipeInfo } from '@aglio/trpc';
import { Prelude } from '@/components/Prelude';
import Head from 'next/head';

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
				<Head>
					<title>Not found</title>
				</Head>
				<PageRoot className={lemonTheme}>
					<PageContent>
						<H1>Not found</H1>
					</PageContent>
				</PageRoot>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>{data.title}</title>
			</Head>
			<PageRoot className={lemonTheme}>
				<PageContent>
					<article
						itemScope
						itemType="https://schema.org/Recipe"
						className="h-recipe"
					>
						<Box mb={6}>
							<H1 itemProp="name" className="p-name">
								{data.title}
							</H1>
							<P itemProp="author" className="p-author">
								Published by {data.publisher?.fullName ?? 'Anonymous'}
							</P>
						</Box>
						{data.prelude && (
							<Box mb={6}>
								<Prelude content={data.prelude} />
							</Box>
						)}
						<Box mb={6}>
							<H2 gutterBottom>Ingredients</H2>
							<IngredientList>
								{data.ingredients.map((ingredient) => (
									<IngredientListItem key={ingredient.id}>
										<div itemProp="recipeIngredient" className="p-ingredient">
											{ingredient.text}
										</div>
										{ingredient.note && <Note>{ingredient.note}</Note>}
									</IngredientListItem>
								))}
							</IngredientList>
						</Box>
						<Box mb={12}>
							<H2 gutterBottom>Instructions</H2>
							<Instructions instructions={data.instructions} />
						</Box>
						<PageFixedArea
							style={{ bottom: 16, top: 'auto', marginBottom: 16 }}
						>
							<a
								href={`${
									process.env.NEXT_APP_GROCERIES_HOST
								}?recipeUrl=${encodeURIComponent(url)}&skipPrompt=true`}
							>
								<Button color="primary">Save to your Collection</Button>
							</a>
						</PageFixedArea>
						<P size="xs" className={sprinkles({ color: 'gray70' })}>
							Powered by{' '}
							<a
								className={sprinkles({ fontWeight: 'bold', color: 'black' })}
								href="https://gnocchi.club"
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
		paths: all.map((slug) => ({ params: { slug } })),
		fallback: false,
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
			url: `${process.env.HOST}/r/${slugBase}`,
		},
	};
}
