import {
	PublishedRecipe,
	PublishedRecipeIngredient,
	PublishedRecipeInstruction,
} from '@aglio/prisma';
import { PageRoot, PageContent } from '@aglio/ui';

export interface PageProps {
	recipe: Pick<
		PublishedRecipe,
		'id' | 'title' | 'slug' | 'version' | 'publishedAt'
	> & {
		ingredients: Pick<PublishedRecipeIngredient, 'id' | 'text'>[];
		instructions: Pick<PublishedRecipeInstruction, 'id' | 'type' | 'content'>[];
	};
}

export function Page({ recipe }: PageProps) {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title></title>
			</head>
			<PageRoot>
				<PageContent></PageContent>
			</PageRoot>
		</html>
	);
}
