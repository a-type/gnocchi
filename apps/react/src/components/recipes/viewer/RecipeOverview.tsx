import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import {
	Box,
	H1,
	H2,
	LinkButton,
	PageNowPlaying,
	Peek,
	sprinkles,
} from '@aglio/ui';
import { format } from 'date-fns/esm';
import { useRecipeFromSlugUrl } from '../hooks.js';
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
import { RecipeTagsViewer } from './RecipeTagsViewer.jsx';
import { RecipeViewerEditButton } from './RecipeViewerEditButton.jsx';
import { RecipePreludeViewer } from './RecipePreludeViewer.jsx';
import { FirstTimeScanOnboarding } from './FirstTimeScanOnboarding.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeTagsEditor } from '../editor/RecipeTagsEditor.jsx';

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

	return (
		<Box direction="column" gap={6} align="flex-start" width="full">
			<FirstTimeScanOnboarding />
			<TitleAndImageLayout>
				<TitleContainer>
					<Box
						width="full"
						alignSelf="flex-start"
						align="flex-start"
						fontSize="xs"
						my={3}
					>
						<H1>{title}</H1>
						<Box
							direction="row"
							justify="space-between"
							align="center"
							width="full"
							gap={3}
						>
							<p className={sprinkles({ m: 0, flex: 1 })}>
								Created on {format(createdAt, 'LLL do, yyyy')}
							</p>
							<Box direction="row" gap={1}>
								<RecipePublishControl recipeId={recipe.get('id')} />
								<RecipeViewerEditButton recipe={recipe} color="primary" />
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
					<Box
						width="auto"
						alignSelf="flex-start"
						gap={2}
						direction="row"
						align="center"
					>
						<RecipeMultiplierField recipe={recipe} />
						<AddToListButton recipe={recipe} />
					</Box>
					<RecipeTagsEditor className={sprinkles({ mt: 3 })} recipe={recipe} />
				</TitleContainer>
				{mainImage && (
					<ImageContainer>
						<RecipeMainImageViewer recipe={recipe} />
					</ImageContainer>
				)}
			</TitleAndImageLayout>
			<PreludeSection recipe={recipe} />
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsViewer recipe={recipe} />
			</div>
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
					<LinkButton
						to={makeRecipeLink(recipe, '/cook/prep')}
						className={classes.cookButton}
					>
						Start prep
					</LinkButton>
					<LinkButton
						color="primary"
						to={makeRecipeLink(recipe, '/cook/steps')}
						className={classes.cookButton}
					>
						Start cooking
					</LinkButton>
				</Box>
			</PageNowPlaying>
		</Box>
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
