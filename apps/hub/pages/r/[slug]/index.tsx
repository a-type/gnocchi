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
	Divider,
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
import { MainImage } from '@/components/MainImage';
import { TopLineRoot, TopLineTitle } from '@/components/layout';

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
							<Box>
								<Prelude content={data.prelude} />
							</Box>
						)}
						<Divider />
						<Box mb={4} mt={4}>
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
						<Divider />
						<Box mb={12} mt={4}>
							<H2 gutterBottom>Instructions</H2>
							<Instructions instructions={data.instructions} />
						</Box>
						<PageFixedArea
							className={sprinkles({
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-end',
							})}
							style={{
								bottom: 16,
								top: 'auto',
								marginBottom: 16,
								background: 'transparent',
							}}
						>
							<a
								href={`${
									process.env.NEXT_APP_GROCERIES_HOST
								}?recipeUrl=${encodeURIComponent(url)}&hub=true`}
							>
								<Button
									color="primary"
									className={sprinkles({
										boxShadow: 'lg',
									})}
								>
									Save to your Collection
								</Button>
							</a>
						</PageFixedArea>
						<P
							size="xs"
							className={sprinkles({
								color: 'gray70',
								marginLeft: 'auto',
								textAlign: 'right',
							})}
						>
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
			url: `${process.env.HOST}/r/${slugBase}`,
		},
	};
}
