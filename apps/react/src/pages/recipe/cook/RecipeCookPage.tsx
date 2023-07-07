import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import {
	RecipeCookProvider,
	useCookingRecipe,
} from '@/components/recipes/cook/RecipeCookContext.jsx';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { Link, Outlet, useMatch, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';
import {
	PageFixedArea,
	PageNowPlaying,
} from '@aglio/ui/src/components/layouts';
import { CookingActionBar } from '@/components/recipes/cook/CookingActionBar.jsx';
import { LinkButton } from '@/components/nav/Link.jsx';
import { H1 } from '@aglio/ui/src/components/typography';
import { TabsList, TabsRoot, TabsTrigger } from '@aglio/ui/src/components/tabs';
import { useWatchChanges } from '@/components/recipes/hooks.js';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Cross2Icon } from '@radix-ui/react-icons';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { SwipeOutlet } from '@/components/nav/SwipeOutlet.jsx';
import { stopPropagation } from '@aglio/tools';
import { CookingToolbar } from '@/components/recipes/cook/CookingToolbar.jsx';
import { AutoRestoreScroll } from '@/components/nav/AutoRestoreScroll.jsx';
import { RecipeCookView } from '@/components/recipes/cook/RecipeCookView.jsx';

export interface RecipeCookPageProps {}

export function RecipeCookPage({}: RecipeCookPageProps) {
	const params = useParams();
	const slug = params.slug as string;

	useWakeLock(true);

	return (
		<RecipeCookProvider slug={slug}>
			<CookPageContents />
		</RecipeCookProvider>
	);
}

export default RecipeCookPage;

function CookPageContents() {
	const recipe = useCookingRecipe();
	useWatchChanges(recipe);

	const isPrep = useMatch({
		path: `prep`,
		end: true,
	});

	return (
		<div className="gap-4 flex flex-col items-start flex-1">
			<PageFixedArea className="flex important:flex-row items-center justify-between gap-2 w-full">
				<CookingActionBar recipe={recipe} />
				<LinkButton
					to={makeRecipeLink(recipe)}
					color="ghost"
					onClick={() => recipe.set('session', null)}
					className="w-auto"
					size="small"
				>
					<span>Stop Cooking</span>
					<Cross2Icon />
				</LinkButton>
			</PageFixedArea>
			<H1>{recipe.get('title')}</H1>
			<RecipeNote recipe={recipe} />
			<div className="flex-1 min-h-90vh flex flex-col w-full">
				<RecipeCookView />
			</div>
			<PageNowPlaying unstyled>
				{!isPrep && <CookingToolbar recipe={recipe} />}
				<RecipesNowPlaying />
			</PageNowPlaying>
		</div>
	);
}
