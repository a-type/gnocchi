import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { RecipeList } from '@/components/recipes/RecipeList.jsx';
import { hooks, recipesDescriptor } from '@/stores/recipes/index.js';
import { Suspense } from 'react';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	return (
		<hooks.Provider value={recipesDescriptor}>
			<PageRoot>
				<PageContent>
					<RecipeList />
				</PageContent>
			</PageRoot>
		</hooks.Provider>
	);
}
