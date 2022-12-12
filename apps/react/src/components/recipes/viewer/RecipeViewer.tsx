import { Box, H1, H2 } from '@/components/primitives/index.js';
import { hooks } from '@/stores/recipes/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeIngredientsViewer } from './RecipeIngredientsViewer.jsx';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { RecipeViewerEditButton } from './RecipeViewerEditButton.jsx';

export interface RecipeViewerProps {
	slug: string;
}

export function RecipeViewer({ slug }: RecipeViewerProps) {
	const recipe = useRecipeFromSlugUrl(slug);
	const { title } = hooks.useWatch(recipe);

	return (
		<Box direction="column" gap={6}>
			<Box direction="row" justify="space-between" gap={3}>
				<H1 className={sprinkles({ mb: 0 })}>{title}</H1>
				<RecipeViewerEditButton
					slug={slug}
					className={sprinkles({ alignSelf: 'start' })}
				/>
			</Box>
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsViewer recipe={recipe} />
			</div>
			<div>
				<H2 gutterBottom>Instructions</H2>
				<RecipeInstructionsViewer recipe={recipe} />
			</div>
		</Box>
	);
}
