import { H1, PageContent, PageRoot } from '@aglio/ui';
import { trpc } from '@/lib/tprc';

export default async function RecipePage({
	params: { slug },
}: {
	params: { slug: string };
}) {
	const data = await trpc.hub.recipeRenderData.query({ slug });

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
		<PageRoot>
			<PageContent>
				<H1>{data.title}</H1>
			</PageContent>
		</PageRoot>
	);
}

export async function generateStaticParams() {
	return (await trpc.hub.allPublishedSlugs.query()).map((slug) => ({ slug }));
}
