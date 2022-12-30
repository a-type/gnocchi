import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { RecipeList } from '@/components/recipes/RecipeList.jsx';
import { hooks, recipesDescriptor } from '@/stores/recipes/index.js';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	return (
		<hooks.Provider value={recipesDescriptor}>
			<PageRoot>
				<PageContent nav>
					<RecipeList />
				</PageContent>
			</PageRoot>
		</hooks.Provider>
	);
}
