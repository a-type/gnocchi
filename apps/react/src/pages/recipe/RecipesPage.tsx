import {
	PageContent,
	PageNowPlaying,
	PageRoot,
} from '@a-type/ui/components/layouts';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { Suspense } from 'react';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { PlusIcon } from '@radix-ui/react-icons';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	usePageTitle('Recipes');
	return (
		<PageContent>
			<Suspense>
				<RecipeList />
			</Suspense>
			<Suspense>
				<PageNowPlaying unstyled className="flex flex-col pointer-events-none">
					<Suspense>
						<RecipeCreateButton className="pointer-events-auto w-48px h-48px md:w-auto md:h-auto mr-4 mb-1 shadow-lg">
							<span className="hidden md:block">New Recipe</span>
							<PlusIcon />
						</RecipeCreateButton>
					</Suspense>
					<RecipesNowPlaying showSingle defaultOpen />
				</PageNowPlaying>
			</Suspense>
		</PageContent>
	);
}

export default RecipesPage;
