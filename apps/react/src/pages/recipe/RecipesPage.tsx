import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { RecipeList } from '@/components/recipes/RecipeList.jsx';
import { hooks, recipesDescriptor } from '@/stores/recipes/index.js';
import { Suspense } from 'react';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	return (
		<hooks.Provider value={recipesDescriptor}>
			<PageRoot>
				<PageContent nav>
					<Suspense>
						<RecipeList />
					</Suspense>
				</PageContent>
			</PageRoot>
		</hooks.Provider>
	);
}
