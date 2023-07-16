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
import { formatMinutes } from '@aglio/tools';
import { withClassName } from '@aglio/ui/hooks';
import classNames from 'classnames';
import { Link } from '@verdant-web/react-router';

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

	const multipliedServings = Math.round((servings ?? 0) * multiplier);

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
							<div className="flex flex-col sm:flex-row justify-between items-start w-full gap-3">
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
								<div className="flex flex-row gap-1 flex-wrap justify-end">
									<RecipePublishControl recipe={recipe} />
									<RecipeViewerEditButton recipe={recipe} />
								</div>
							</div>
							{url && (
								<Link to={url} newTab className="font-bold">
									View original
								</Link>
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

const Detail = withClassName(
	'div',
	'inline-flex flex-row gap-1 items-center whitespace-nowrap border-light border-solid border-1 rounded-full px-2 py-1',
);
