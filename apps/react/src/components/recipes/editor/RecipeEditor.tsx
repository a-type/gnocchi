import { H2, Box } from '@/components/primitives/index.js';
import { hooks } from '@/stores/recipes/index.js';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeIngredientsEditor } from './RecipeIngredientsEditor.jsx';
import { RecipeInstructionsField } from './RecipeInstructionsField.jsx';
import { RecipeTitleField } from './RecipeTitleField.jsx';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	return (
		<Box direction="column" gap={8}>
			<RecipeTitleField recipe={recipe} />
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsEditor recipe={recipe} />
			</div>
			<div>
				<H2 gutterBottom>Instructions</H2>
				<RecipeInstructionsField recipe={recipe} />
			</div>
		</Box>
	);
}
