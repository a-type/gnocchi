import { Checkbox, H1, H2, lemonTheme, PageContent, PageRoot } from '@aglio/ui';
import { trpc } from '@/lib/tprc';
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';
import { HubRecipeInfo } from '@aglio/tools';

export default function RecipePage({ data }: { data: HubRecipeInfo }) {
	if (!data) {
		return (
			<PageRoot>
				<PageContent>
					<H1>Not found</H1>
				</PageContent>
			</PageRoot>
		);
	}

	return (
		<PageRoot className={lemonTheme}>
			<PageContent>
				<H1>{data.title}</H1>
				<H2>Ingredients</H2>
				<ul>
					{data.ingredients.map((ingredient) => (
						<li key={ingredient.id}>
							<Checkbox /> {ingredient.text}
						</li>
					))}
				</ul>
				<H2>Instructions</H2>
				<ol>
					{data.instructions.map((instruction) => (
						<li key={instruction.id}>{instruction.content}</li>
					))}
				</ol>
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
	const data = await trpc.hub.recipeRenderData.query({
		slug: context.params.slug as string,
	});

	return {
		props: {
			data,
		},
	};
}
