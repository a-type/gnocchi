import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { Outlet } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default RecipeViewPage;
