import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import {
	RecipeCookProvider,
	useCookingRecipe,
} from '@/components/recipes/cook/RecipeCookContext.jsx';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { Link, Outlet, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';
import { PageFixedArea } from '@aglio/ui/src/components/layouts';
import { CookingActionBar } from '@/components/recipes/cook/CookingActionBar.jsx';
import { LinkButton } from '@/components/nav/Link.jsx';
import { H1 } from '@aglio/ui/src/components/typography';
import { TabsList, TabsRoot, TabsTrigger } from '@aglio/ui/src/components/tabs';
import { useWatchChanges } from '@/components/recipes/hooks.js';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Cross2Icon } from '@radix-ui/react-icons';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';

export interface RecipeCookPageProps {}

export function RecipeCookPage({}: RecipeCookPageProps) {
	const params = useParams();
	const slug = params.slug as string;

	useWakeLock(true);

	return (
		<RecipeCookProvider slug={slug}>
			<CookPageContents />
			<Suspense>
				<RecipesNowPlaying />
			</Suspense>
		</RecipeCookProvider>
	);
}

export default RecipeCookPage;

function CookPageContents() {
	const recipe = useCookingRecipe();
	useWatchChanges(recipe);

	return (
		<div className="gap-4 flex flex-col items-start mb-300px">
			<PageFixedArea className="flex important:flex-row items-center justify-between gap-2 w-full">
				<CookingActionBar recipe={recipe} />
				<LinkButton
					to={makeRecipeLink(recipe)}
					color="ghost"
					onClick={() => recipe.set('session', null)}
					className="w-auto"
				>
					<span>Stop Cooking</span>
					<Cross2Icon />
				</LinkButton>
			</PageFixedArea>
			<H1>{recipe.get('title')}</H1>
			<RecipeNote recipe={recipe} />
			<TabsRoot
				value={window.location.pathname.split('/').pop()}
				className="w-full"
			>
				<TabsList className="w-full">
					<Link to={makeRecipeLink(recipe, '/cook/prep')} skipTransition>
						<TabsTrigger value="prep">Prep</TabsTrigger>
					</Link>
					<Link to={makeRecipeLink(recipe, '/cook/steps')} skipTransition>
						<TabsTrigger value="steps">Cook</TabsTrigger>
					</Link>
				</TabsList>
			</TabsRoot>
			<Suspense>
				<Outlet />
			</Suspense>
		</div>
	);
}
