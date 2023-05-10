import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { RecipeOverview } from '@/components/recipes/viewer/RecipeOverview.jsx';
import { useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface RecipeOverviewPageProps {}

export function RecipeOverviewPage({}: RecipeOverviewPageProps) {
	const { slug } = useParams();

	return (
		<>
			<RecipeOverview slug={slug as string} />
			<Suspense>
				<RecipesNowPlaying showSingle />
			</Suspense>
		</>
	);
}

export default RecipeOverviewPage;
