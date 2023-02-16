import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Box, H1, H2, LinkButton, PageNowPlaying, sprinkles } from '@aglio/ui';
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
	const { title, createdAt, url } = hooks.useWatch(recipe);

	return (
		<Box direction="column" gap={6} align="flex-start" width="full">
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
							<RecipeViewerEditButton
								recipe={recipe}
								className={sprinkles({ ml: 4 })}
								color="primary"
							/>
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
				<ImageContainer>
					<RecipeMainImageViewer recipe={recipe} />
				</ImageContainer>
			</TitleAndImageLayout>
			<RecipePublishControl recipeId={recipe.get('id')} />
			<RecipeTagsViewer recipe={recipe} />
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
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsViewer recipe={recipe} />
			</div>
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
