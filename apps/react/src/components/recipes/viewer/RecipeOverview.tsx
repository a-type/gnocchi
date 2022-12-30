import { Box, H1, H2 } from '@/components/primitives/index.js';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { hooks } from '@/stores/recipes/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { AddToListButton } from './AddToListButton.jsx';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeMultiplierField } from './RecipeMultiplierField.jsx';
import { RecipeViewerEditButton } from './RecipeViewerEditButton.jsx';

export interface RecipeOverviewProps {
	slug: string;
}

export function RecipeOverview({ slug }: RecipeOverviewProps) {
	const recipe = useRecipeFromSlugUrl(slug);
	const { title } = hooks.useWatch(recipe);

	return (
		<Box direction="column" gap={6}>
			<Box
				direction="row"
				justify="space-between"
				align="baseline"
				gap={3}
				my={3}
			>
				<H1 className={sprinkles({ mb: 0 })} gutterBottom={false}>
					{title}
				</H1>
				<RecipeViewerEditButton
					slug={slug}
					className={sprinkles({ alignSelf: 'center' })}
				/>
			</Box>
			<Box width="auto" alignSelf="start" align="start" gap={2}>
				<AddToListButton recipe={recipe} />
				<RecipeMultiplierField recipe={recipe} />
			</Box>
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsViewer recipe={recipe} />
			</div>
		</Box>
	);
}
