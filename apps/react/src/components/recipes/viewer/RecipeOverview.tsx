import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { RecipeStartCookingButton } from '@/components/recipes/viewer/RecipeStartCookingButton.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Divider } from '@aglio/ui/components/divider';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { Peek } from '@aglio/ui/components/peek';
import { H1, H2, P } from '@aglio/ui/components/typography';
import { format } from 'date-fns/esm';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { RecipeTagsEditor } from '../editor/RecipeTagsEditor.jsx';
import { useRecipeFromSlugUrl, useWatchChanges } from '../hooks.js';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { AddToListButton } from './AddToListButton.jsx';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeMainImageViewer } from './RecipeMainImageViewer.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
import { RecipePreludeViewer } from './RecipePreludeViewer.jsx';
import { RecipePublishControl } from './RecipePublishControl.jsx';
import { RecipeViewerEditButton } from './RecipeViewerEditButton.jsx';
import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { Suspense } from 'react';

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
	const { title, createdAt, url, mainImage } = hooks.useWatch(recipe);
	useWatchChanges(recipe);

	return (
		<>
			<HeaderBar backUrl="/recipes" />
			<OnboardingBanner onboarding={saveHubRecipeOnboarding} step="recipe">
				<H2>This is your copy!</H2>
				<P>Feel free to make changes, add notes, etc.</P>
			</OnboardingBanner>
			<div className="flex flex-col gap-6 items-start w-full">
				<TitleAndImageLayout>
					<TitleContainer>
						<div className="w-full flex flex-col items-start self-start text-xs my-3 gap-4">
							<H1>{title}</H1>
							<RecipeNote recipe={recipe} />
							<div className="flex flex-row justify-between items-start w-full gap-3">
								<p className="m-0 flex-1 mt-2">
									Created on {format(createdAt, 'LLL do, yyyy')}
								</p>
								<div className="flex flex-row gap-1 flex-wrap justify-end">
									<RecipePublishControl recipe={recipe} />
									<RecipeViewerEditButton recipe={recipe} />
								</div>
							</div>
							{url && (
								<a
									href={url}
									target="_blank"
									rel="noreferrer"
									className="font-bold"
								>
									View original
								</a>
							)}
						</div>
					</TitleContainer>
					{mainImage && (
						<ImageContainer>
							<RecipeMainImageViewer recipe={recipe} />
						</ImageContainer>
					)}
				</TitleAndImageLayout>
				<div className="w-auto flex flex-row items-center self-start gap-6">
					<AddToListButton color="primary" recipe={recipe} />
					<RecipeMultiplierField recipe={recipe} />
				</div>
				<RecipeTagsEditor className="mt-3" recipe={recipe} />
				<PreludeSection recipe={recipe} />
				<Divider />
				<div className="w-full">
					<H2 className="gutter-bottom">Ingredients</H2>
					<RecipeIngredientsViewer recipe={recipe} />
				</div>
				<Divider />
				<div className="w-full">
					<H2 className="gutter-bottom">Instructions</H2>
					<Peek>
						<RecipeInstructionsViewer recipe={recipe} />
					</Peek>
				</div>
				<PageNowPlaying unstyled>
					<div className="flex flex-row gap-2 items-center justify-end w-full">
						<RecipeStartCookingButton recipe={recipe} className="shadow-lg">
							Start cooking
						</RecipeStartCookingButton>
					</div>
					<Suspense>
						<RecipesNowPlaying showSingle />
					</Suspense>
				</PageNowPlaying>
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
