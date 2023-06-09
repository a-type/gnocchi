import {
	PageContent,
	PageNowPlaying,
	PageRoot,
} from '@aglio/ui/components/layouts';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { Suspense } from 'react';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	return (
		<PageContent>
			<Suspense>
				<RecipeList />
			</Suspense>
			<Suspense>
				<PageNowPlaying unstyled>
					<RecipesNowPlaying showSingle defaultOpen />
				</PageNowPlaying>
			</Suspense>
		</PageContent>
	);
}

export default RecipesPage;
