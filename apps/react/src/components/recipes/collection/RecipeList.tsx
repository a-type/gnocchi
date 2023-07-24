import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';
import { Button } from '@aglio/ui/components/button';
import { InfiniteLoadTrigger } from '@aglio/ui/components/infiniteLoadTrigger';
import { PageFixedArea } from '@aglio/ui/components/layouts';
import { withClassName } from '@aglio/ui/hooks';
import { Spinner } from '@aglio/ui/src/components/spinner';
import { Suspense } from 'react';
import { RecipeListActions } from './RecipeListActions.jsx';
import { useFilteredRecipes } from './hooks.js';
import {
	RecipeListItem,
	RecipePlaceholderItem,
} from '@/components/recipes/collection/RecipeListItem.jsx';
import { CardGrid } from '@aglio/ui/components/card';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<div className="flex flex-col gap-4 p-0 m-0 mb-6">
			<div className="flex flex-row items-center justify-between">
				<Suspense
					fallback={
						<Button color="primary" className="self-start">
							Create New
						</Button>
					}
				>
					<RecipeCreateButton />
				</Suspense>
				<RecipeCollectionMenu />
			</div>
			<Suspense>
				<PageFixedArea className="pt-2">
					<RecipeSearchBar className="w-full" />
					<RecipeListActions />
				</PageFixedArea>
			</Suspense>
			<Suspense
				fallback={
					<CardGrid>
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
					</CardGrid>
				}
			>
				<RecipeListContent />
				<AutoRestoreScroll id="recipesList" />
			</Suspense>
		</div>
	);
}

function RecipeListContent() {
	const [recipes, { loadMore, hasMore }] = useFilteredRecipes();

	if (!recipes.length) {
		return <EmptyState />;
	}

	return (
		<>
			<CardGrid>
				{recipes.map((recipe) => (
					<RecipeListItem key={recipe.get('id')} recipe={recipe} />
				))}
			</CardGrid>
			{hasMore && (
				<InfiniteLoadTrigger onVisible={loadMore} className="mt-6 w-full">
					<Spinner />
				</InfiniteLoadTrigger>
			)}
		</>
	);
}
