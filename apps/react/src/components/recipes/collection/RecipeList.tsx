import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { PinnedRecipes } from '@/components/recipes/collection/PinnedRecipes.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import {
	RecipeListItem,
	RecipePlaceholderItem,
} from '@/components/recipes/collection/RecipeListItem.jsx';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { Button } from '@aglio/ui/components/button';
import { CardGrid } from '@aglio/ui/components/card';
import { InfiniteLoadTrigger } from '@aglio/ui/components/infiniteLoadTrigger';
import { PageFixedArea } from '@aglio/ui/components/layouts';
import { Spinner } from '@aglio/ui/src/components/spinner';
import { Suspense } from 'react';
import { RecipeListActions } from './RecipeListActions.jsx';
import { useFilteredRecipes } from './hooks.js';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	const showPinned = useFeatureFlag('pinnedRecipes');

	return (
		<div className="flex flex-col p-0 m-0 mb-6">
			<Suspense>
				<PageFixedArea className="pt-2 w-full mb-4">
					<div className="flex flex-row items-center justify-stretch w-full">
						<RecipeSearchBar className="flex-1" />
						<RecipeCollectionMenu className="flex-0-0-auto" />
					</div>
					<RecipeListActions />
				</PageFixedArea>
			</Suspense>
			{showPinned && (
				<Suspense>
					<PinnedRecipes />
				</Suspense>
			)}
			<Suspense
				fallback={
					<CardGrid>
						<RecipePlaceholderItem className="min-h-200px md:(h-30vh max-h-300px)" />
						<RecipePlaceholderItem className="min-h-200px md:(h-30vh max-h-300px)" />
						<RecipePlaceholderItem className="min-h-200px md:(h-30vh max-h-300px)" />
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
					<RecipeListItem
						key={recipe.get('id')}
						recipe={recipe}
						className="min-h-200px md:(h-30vh max-h-300px)"
					/>
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
