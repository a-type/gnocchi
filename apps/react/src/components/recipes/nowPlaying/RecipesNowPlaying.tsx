import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/src/components/collapsible';
import { PageNowPlaying } from '@aglio/ui/src/components/layouts';
import * as classes from './RecipesNowPlaying.css.js';
import { Button } from '@aglio/ui/src/components/button';
import { Span } from '@aglio/ui/src/components/typography';
import { Recipe } from '@aglio/groceries-client';
import { RecipeMainImageViewer } from '@/components/recipes/viewer/RecipeMainImageViewer.jsx';
import { Link } from '@verdant-web/react-router';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import { RecipeNowPlayingLink } from '@/components/recipes/nowPlaying/RecipeNowPlayingLink.jsx';
import { ChevronDownIcon } from '@radix-ui/react-icons';

export interface RecipesNowPlayingProps {
	showSingle?: boolean;
	defaultOpen?: boolean;
}

export function RecipesNowPlaying({
	showSingle,
	defaultOpen,
}: RecipesNowPlayingProps) {
	const { firstRecipe, otherRecipes } = useNowPlayingRecipes();

	if (!firstRecipe) {
		return null;
	}
	if (!showSingle && otherRecipes.length === 0) {
		return null;
	}

	return (
		<PageNowPlaying className={classes.root}>
			<CollapsibleRoot defaultOpen={defaultOpen} className={classes.inner}>
				<CollapsibleTrigger asChild>
					<div className={classes.topBar}>
						<Span size="xs" italic className={classes.label}>
							Now Cooking
						</Span>
						<ChevronDownIcon className={classes.collapseIcon} />
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className={classes.list}>
						<RecipeNowPlayingLink recipe={firstRecipe} />
						{otherRecipes.map((recipe) => (
							<RecipeNowPlayingLink key={recipe.get('id')} recipe={recipe} />
						))}
					</div>
				</CollapsibleContent>
			</CollapsibleRoot>
		</PageNowPlaying>
	);
}
