import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { format } from 'date-fns/esm';
import {
	useRecipeFromSlugUrl,
	useStartNewSessionIfNeeded,
	useWatchChanges,
} from '../hooks.js';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { makeRecipeLink } from '../makeRecipeLink.js';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { AddToListButton } from './AddToListButton.jsx';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';
import { RecipeMainImageViewer } from './RecipeMainImageViewer.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
import * as classes from './RecipeOverview.css.js';
import { RecipePublishControl } from './RecipePublishControl.jsx';
import { RecipeViewerEditButton } from './RecipeViewerEditButton.jsx';
import { RecipePreludeViewer } from './RecipePreludeViewer.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeTagsEditor } from '../editor/RecipeTagsEditor.jsx';
import { OnboardingBanner } from '@/components/onboarding/OnboardingBanner.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { Box } from '@aglio/ui/components/box';
import { H1, H2, P } from '@aglio/ui/components/typography';
import { sprinkles } from '@aglio/ui/styles';
import { Divider } from '@aglio/ui/components/divider';
import { Peek } from '@aglio/ui/components/peek';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { LinkButton } from '@/components/nav/Link.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { RecipeStartCookingButton } from '@/components/recipes/viewer/RecipeStartCookingButton.jsx';

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

	const startSession = useStartNewSessionIfNeeded(recipe);

	return (
		<>
			<HeaderBar backUrl="/recipes" />
			<OnboardingBanner onboarding={saveHubRecipeOnboarding} step="recipe">
				<H2>This is your copy!</H2>
				<P>Feel free to make changes, add notes, etc.</P>
			</OnboardingBanner>
			<Box direction="column" gap={6} align="flex-start" width="full">
				<TitleAndImageLayout>
					<TitleContainer>
						<Box
							width="full"
							alignSelf="flex-start"
							align="flex-start"
							fontSize="xs"
							my={3}
							gap={4}
						>
							<H1>{title}</H1>
							<RecipeNote recipe={recipe} />
							<Box
								direction="row"
								justify="space-between"
								align="flex-start"
								width="full"
								gap={3}
							>
								<p className={sprinkles({ m: 0, flex: 1, mt: 2 })}>
									Created on {format(createdAt, 'LLL do, yyyy')}
								</p>
								<Box
									direction="row"
									gap={1}
									flexWrap="wrap"
									justifyContent="flex-end"
								>
									<RecipePublishControl recipe={recipe} />
									<RecipeViewerEditButton recipe={recipe} />
								</Box>
							</Box>
							{url && (
								<a
									href={url}
									target="_blank"
									rel="noreferrer"
									className={sprinkles({ fontWeight: 'bold' })}
								>
									View original
								</a>
							)}
						</Box>
					</TitleContainer>
					{mainImage && (
						<ImageContainer>
							<RecipeMainImageViewer recipe={recipe} />
						</ImageContainer>
					)}
				</TitleAndImageLayout>
				<Box
					width="auto"
					alignSelf="flex-start"
					gap={6}
					direction="row"
					align="center"
				>
					<AddToListButton color="primary" recipe={recipe} />
					<RecipeMultiplierField recipe={recipe} />
				</Box>
				<RecipeTagsEditor className={sprinkles({ mt: 3 })} recipe={recipe} />
				<PreludeSection recipe={recipe} />
				<Divider />
				<Box width="full">
					<H2 gutterBottom>Ingredients</H2>
					<RecipeIngredientsViewer recipe={recipe} />
				</Box>
				<Divider />
				<Box width="full">
					<H2 gutterBottom>Instructions</H2>
					<Peek>
						<RecipeInstructionsViewer recipe={recipe} />
					</Peek>
				</Box>
				<PageNowPlaying unstyled>
					<Box
						direction="row"
						gap={2}
						align="center"
						justify="flex-end"
						width="full"
					>
						<RecipeStartCookingButton
							recipe={recipe}
							className={classes.cookButton}
						>
							Start cooking
						</RecipeStartCookingButton>
					</Box>
				</PageNowPlaying>
			</Box>
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
		<Box width="full">
			<H2 gutterBottom>Description</H2>
			<RecipePreludeViewer recipe={recipe} />
		</Box>
	);
}
