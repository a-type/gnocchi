import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Divider } from '@aglio/ui/components/divider';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { H1, H2, P } from '@aglio/ui/components/typography';
import { format } from 'date-fns/esm';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { RecipeTagsEditor } from '../editor/RecipeTagsEditor.jsx';
import {
	useActiveCookingSession,
	useRecipeFromSlugUrl,
	useWatchChanges,
} from '../hooks.js';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { AddToListButton } from './AddToListButton.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeMainImageViewer } from './RecipeMainImageViewer.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
import { RecipePreludeViewer } from './RecipePreludeViewer.jsx';
import { RecipePublishControl } from './RecipePublishControl.jsx';
import { RecipeViewerEditButton } from './RecipeViewerEditButton.jsx';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { Suspense, useEffect, useRef } from 'react';
import { formatMinutes } from '@aglio/tools';
import { withClassName } from '@aglio/ui/hooks';
import classNames from 'classnames';
import { Link } from '@verdant-web/react-router';
import { OpenInNewWindowIcon, PlusIcon } from '@radix-ui/react-icons';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import {
	CollapsibleRoot,
	CollapsibleContent,
} from '@aglio/ui/components/collapsible';
import { useSnapshot } from 'valtio';
import { viewerState } from '@/components/recipes/viewer/state.js';
import { CookingToolbar } from '@/components/recipes/cook/CookingToolbar.jsx';
import { IngredientCheckoffView } from '@/components/recipes/cook/IngredientCheckoffView.jsx';
import { InstructionsProvider } from '@/components/recipes/editor/InstructionStepNodeView.jsx';
import { AddNotePrompt } from '@/components/recipes/cook/AddNotePrompt.jsx';
import { AddImagePrompt } from '@/components/recipes/cook/AddImagePrompt.jsx';
import { CookingActionBar } from '@/components/recipes/cook/CookingActionBar.jsx';
import { useWakeLock } from '@/hooks/useWakeLock.js';

export interface RecipeOverviewProps {
	slug: string;
}

export function RecipeOverview({ slug }: RecipeOverviewProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	if (!recipe) {
		return <RecipeNotFound />;
	}

	return <RecipeOverviewContent recipe={recipe} />;
}

function RecipeOverviewContent({ recipe }: { recipe: Recipe }) {
	const {
		title,
		createdAt,
		url,
		mainImage,
		cookTimeMinutes,
		prepTimeMinutes,
		totalTimeMinutes,
		servings,
		multiplier,
	} = hooks.useWatch(recipe);
	useWatchChanges(recipe);

	useViewingRecipePresence(recipe);

	const multipliedServings = Math.round((servings ?? 0) * multiplier);

	usePageTitle(title.slice(0, 20));

	const stepsRef = useShowToolsWhenStepsVisible();

	useWakeLock();

	return (
		<>
			<div id="pageTop" className="w-0 h-0" />
			<HeaderBar backUrl="/recipes">
				<CookingActionBar recipe={recipe} />
			</HeaderBar>
			<OnboardingBanner onboarding={saveHubRecipeOnboarding} step="recipe">
				<H2>This is your copy!</H2>
				<P>Feel free to make changes, add notes, etc.</P>
			</OnboardingBanner>
			<div className="flex flex-col gap-6 items-start w-full pb-33vh">
				<TitleAndImageLayout>
					<TitleContainer>
						<div className="w-full flex flex-col items-start self-start text-xs my-3 gap-4">
							<H1>{title}</H1>
							<div className="flex flex-row gap-1 flex-wrap items-center w-full">
								<RecipePublishControl recipe={recipe} />
								<RecipeViewerEditButton recipe={recipe} />
							</div>
							<div className="flex flex-col justify-between items-start w-full gap-3">
								<div className="flex flex-row gap-1 flex-wrap">
									<Detail>
										Created on {format(createdAt, 'LLL do, yyyy')}
									</Detail>
									{!!totalTimeMinutes && (
										<Detail>
											Total time: {formatMinutes(totalTimeMinutes)}
										</Detail>
									)}
									{!!prepTimeMinutes && (
										<Detail>Prep time: {formatMinutes(prepTimeMinutes)}</Detail>
									)}
									{!!cookTimeMinutes && (
										<Detail>Cook time: {formatMinutes(cookTimeMinutes)}</Detail>
									)}
									{!!servings && (
										<Detail>
											Serves{' '}
											<span
												className={classNames({
													'font-bold text-accent-dark': multiplier !== 1,
												})}
											>
												{multipliedServings.toLocaleString()}
											</span>
										</Detail>
									)}
								</div>
								<RecipeTagsEditor recipe={recipe} className="flex-1" />
							</div>
						</div>
					</TitleContainer>
					{mainImage && (
						<ImageContainer>
							<RecipeMainImageViewer recipe={recipe} />
						</ImageContainer>
					)}
				</TitleAndImageLayout>
				<PreludeSection recipe={recipe} />
				{url && (
					<Link to={url} newTab className="font-bold">
						View original <OpenInNewWindowIcon className="ml-2 relative b--1" />
					</Link>
				)}
				<RecipeNote recipe={recipe} />

				<Divider />
				<div className="w-full gap-4 flex flex-col">
					<div className="w-auto flex flex-row items-center justify-between self-start gap-6 w-full">
						<H2>Ingredients</H2>
						<RecipeMultiplierField recipe={recipe} />
					</div>
					{/* Seems redundant now? */}
					<AddToListButton color="primary" recipe={recipe}>
						<PlusIcon />
						<span>Add all to list</span>
					</AddToListButton>
					<IngredientCheckoffView recipe={recipe} />
				</div>
				<Divider />
				<div className="w-full flex flex-col gap-4" ref={stepsRef}>
					<H2>Instructions</H2>
					<InstructionsProvider
						isEditing={false}
						showTools
						recipeId={recipe.get('id')}
					>
						<RecipeInstructionsViewer recipe={recipe} />
					</InstructionsProvider>
				</div>
				<PostCooking recipe={recipe} />
				<OverviewNowPlaying recipe={recipe} />
			</div>
		</>
	);
}

function PreludeSection({ recipe }: { recipe: Recipe }) {
	const prelude = hooks.useWatch(recipe, 'prelude');
	hooks.useWatch(prelude);

	if (prelude.get('content')?.length === 0) {
		return null;
	}

	return (
		<div className="w-full">
			<H2 className="gutter-bottom">Description</H2>
			<RecipePreludeViewer recipe={recipe} />
		</div>
	);
}

const Detail = withClassName(
	'div',
	'inline-flex flex-row gap-1 items-center whitespace-nowrap border-light border-solid border-1 rounded-full px-2 py-1',
);

function OverviewNowPlaying({ recipe }: { recipe: Recipe }) {
	const { showCookTools } = useSnapshot(viewerState);
	return (
		<PageNowPlaying unstyled>
			<div className="flex flex-row gap-2 items-center justify-end w-full">
				{showCookTools && (
					<CookingToolbar
						recipe={recipe}
						className="animate-pop-up animate-duration-200 animate-springy"
					/>
				)}
			</div>
			<Suspense>
				<RecipesNowPlaying showSingle={false} />
			</Suspense>
		</PageNowPlaying>
	);
}

function useShowToolsWhenStepsVisible() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			const entry = entries[0];
			if (entry.isIntersecting) {
				viewerState.showCookTools = true;
			} else {
				viewerState.showCookTools = false;
			}
		});
		observer.observe(el);
		return () => {
			observer.disconnect();
		};
	}, []);
	return ref;
}

function useViewingRecipePresence(recipe: Recipe) {
	const recipeId = recipe?.get('id') ?? null;
	const client = hooks.useClient();
	useEffect(() => {
		client.sync.presence.update({ viewingRecipeId: recipeId });
	}, [recipeId, client]);
	useEffect(() => {
		return () => {
			client.sync.presence.update({ viewingRecipeId: null });
		};
	}, [client]);
}

function PostCooking({ recipe }: { recipe: Recipe }) {
	const activeSession = useActiveCookingSession(recipe);
	if (!activeSession) return null;

	return (
		<Suspense>
			<div className="w-full flex flex-col items-stretch mt-10 gap-3">
				<AddImagePrompt recipe={recipe} />
				<AddNotePrompt recipe={recipe} />
			</div>
		</Suspense>
	);
}
