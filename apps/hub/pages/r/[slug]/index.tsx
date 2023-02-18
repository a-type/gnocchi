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
} from '@aglio/ui';
import { trpc } from '@/lib/tprc';
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import { HubRecipeInfo } from '@aglio/tools';
import {
	IngredientList,
	IngredientListItem,
} from '@/components/IngredientList';
import { Instructions } from '@/components/Instructions';

export default function RecipePage({ data }: { data: HubRecipeInfo }) {
	if (!data) {
		return (
			<PageRoot className={lemonTheme}>
				<PageContent>
					<H1>Not found</H1>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot className={lemonTheme}>
			<PageContent>
				<Box mb={6}>
					<H1>{data.title}</H1>
					<P>Published by {data.publisher?.fullName ?? 'Anonymous'}</P>
				</Box>
				<Box mb={6}>
					<H2 gutterBottom>Ingredients</H2>
					<IngredientList>
						{data.ingredients.map((ingredient) => (
							<IngredientListItem key={ingredient.id}>
								{ingredient.text}
							</IngredientListItem>
						))}
					</IngredientList>
				</Box>
				<Box mb={6}>
					<H2 gutterBottom>Instructions</H2>
					<Instructions instructions={data.instructions} />
				</Box>
			</PageContent>
		</PageRoot>
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
		},
	};
}
