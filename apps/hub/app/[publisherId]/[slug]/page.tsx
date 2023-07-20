import {
	IngredientList,
	IngredientListItem,
} from '@/components/IngredientList.jsx';
import { Instructions } from '@/components/Instructions.jsx';
import { MainImage } from '@/components/MainImage.jsx';
import { Prelude } from '@/components/Prelude.jsx';
import { TopLineRoot, TopLineTitle } from '@/components/layout.jsx';
import { trpc } from '@/lib/tprc.js';
import { Button } from '@aglio/ui/components/button';
import { Divider } from '@aglio/ui/components/divider';
import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@aglio/ui/components/layouts';
import { Note } from '@aglio/ui/components/note';
import { H1, H2, P } from '@aglio/ui/components/typography';

export async function generateMetadata(props: {
	params: { slug: string; publisherId: string };
}) {
	if (!props.params.slug) throw new Error('No slug');
	const data = await getData(props.params.slug);
	if (!data.data) {
		return 'Not Found';
	} else {
		return data.data.title;
	}
}

export default async function RecipePage({
	params,
}: {
	params: { slug: string };
}) {
	const { data, url } = await getData(params.slug);

	if (!data) {
		return (
			<PageRoot className="theme-lemon">
				<PageContent>
					<H1>Not found</H1>
				</PageContent>
			</PageRoot>
		);
	}

	return (
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
							}?recipeUrl=${encodeURIComponent(url)}&hub=true&skipWelcome=true`}
						>
							<Button color="primary" className="shadow-lg">
								Save Recipe
							</Button>
						</a>
					</PageFixedArea>
					<P className="color-gray7 ml-auto text-right text-sm">
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
	);
}

export async function generateStaticParams() {
	const all = await trpc.hub.allPublishedSlugs.query();
	return all.map((info) => ({
		slug: info.slug,
		publisherId: info.publisherId,
	}));
}

export const dynamicParams = true;

async function getData(slugBase: string) {
	const slug = slugBase.split('-').pop();
	if (!slug) throw new Error('No slug');
	const data = await trpc.hub.recipeRenderData.query({
		slug,
	});

	return {
		data,
		url: `${process.env.HOST}/${slugBase}`,
	};
}
