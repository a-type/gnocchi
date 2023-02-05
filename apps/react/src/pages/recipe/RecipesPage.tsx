import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { RecipeList } from '@/components/recipes/collection/RecipeList.jsx';
import { Suspense } from 'react';

export interface RecipesPageProps {}

export function RecipesPage({}: RecipesPageProps) {
	return (
		<PageRoot>
			<PageContent nav>
				<Suspense>
					<RecipeList />
				</Suspense>
			</PageContent>
		</PageRoot>
	);
}

export default RecipesPage;
