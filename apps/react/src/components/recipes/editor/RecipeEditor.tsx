import { H2, Box, LiveUpdateTextField } from '@/components/primitives/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeDeleteButton } from './RecipeDeleteButton.jsx';
import { RecipeIngredientsEditor } from './RecipeIngredientsEditor.jsx';
import { RecipeInstructionsField } from './RecipeInstructionsField.jsx';
import { RecipeTitleField } from './RecipeTitleField.jsx';
import { RecipeUrlField } from './RecipeUrlField.jsx';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	return (
		<Box direction="column" gap={8}>
			<RecipeTitleField recipe={recipe} />
			<RecipeUrlField recipe={recipe} />
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsEditor recipe={recipe} />
			</div>
			<div>
				<H2 gutterBottom>Instructions</H2>
				<RecipeInstructionsField recipe={recipe} />
			</div>
			<RecipeDeleteButton
				className={sprinkles({ alignSelf: 'start' })}
				recipe={recipe}
			/>
		</Box>
	);
}
