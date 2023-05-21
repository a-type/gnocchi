import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { Suspense } from 'react';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Suspense>
					<RecipeList />
				</Suspense>
				<Suspense>
					<RecipesNowPlaying showSingle defaultOpen />
				</Suspense>
			</PageContent>
		</PageRoot>
	);
}

export default RecipesPage;
