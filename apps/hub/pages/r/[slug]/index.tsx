import { H1, lemonTheme, PageContent, PageRoot } from '@aglio/ui';
import { trpc } from '@/lib/tprc';
import {
	GetStaticPathsResult,
	GetStaticPropsContext,
	GetStaticPropsResult,
} from 'next';

export default function RecipePage({ data }: { data: any }) {
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
