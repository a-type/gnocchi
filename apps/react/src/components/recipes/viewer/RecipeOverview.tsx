import { PageNowPlaying } from '@/components/layouts/index.jsx';
import { Box, H1, H2, LinkButton, P } from '@/components/primitives/index.js';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { hooks } from '@/stores/groceries/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { Recipe } from '@aglio/groceries-client';
import { format } from 'date-fns/esm';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { makeRecipeLink } from '../makeRecipeLink.js';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { AddToListButton } from './AddToListButton.jsx';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
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
		<Box direction="column" gap={6} align="start">
			<Box width="auto" alignSelf="start" align="start" fontSize="xs" my={3}>
				<H1>{title}</H1>
				<Box direction="row" justify="space-between" align="center" gap={3}>
					<p className={sprinkles({ m: 0 })}>
						Created on {format(createdAt, 'LLL do, yyyy')}
					</p>
					<RecipeViewerEditButton
						recipe={recipe}
						className={sprinkles({ ml: 4 })}
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
			<RecipeTagsViewer recipe={recipe} />
			<Box
				width="auto"
				alignSelf="start"
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
				<Box direction="row" gap={2} align="center" justify="end" width="full">
					<LinkButton to={makeRecipeLink(recipe, '/cook/prep')}>
						Start prep
					</LinkButton>
					<LinkButton color="primary" to={makeRecipeLink(recipe, '/cook/prep')}>
						Start cooking
					</LinkButton>
				</Box>
			</PageNowPlaying>
		</Box>
	);
}
