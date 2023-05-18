import { RecipeNowPlayingLink } from '@/components/recipes/nowPlaying/RecipeNowPlayingLink.jsx';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
} from '@aglio/ui/src/components/collapsible';
import { PageNowPlaying } from '@aglio/ui/src/components/layouts';
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
		<PageNowPlaying className="flex flex-col items-start w-full bg-white rounded-lg shadow-lg border-light overflow-hidden animate-fade-in-up animate-duration-300 ease-out">
			<CollapsibleRoot defaultOpen={defaultOpen} className="w-full">
				<CollapsibleTrigger asChild>
					<div className="flex flex-row items-center justify-between w-full pr-5">
						<span className="text-xs italic py-1 px-2">Now Cooking</span>
						<ChevronDownIcon className="transition-transform duration-200 [[data-state=closed]_&]:rotate-180" />
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="flex flex-col gap-2">
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
