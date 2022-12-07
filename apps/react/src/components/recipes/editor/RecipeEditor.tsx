import { H2, Box } from '@/components/primitives/index.js';
import { hooks } from '@/stores/recipes/index.js';
import { RecipeIngredientsEditor } from './RecipeIngredientsEditor.jsx';
import { RecipeInstructionsField } from './RecipeInstructionsField.jsx';
import { RecipeTitleField } from './RecipeTitleField.jsx';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const slugId = slug.split('-').pop();
	const recipe = hooks.useOneRecipe({
		index: {
			where: 'slug',
			equals: slugId,
		},
	});

	return (
		<Box direction="column" gap={8}>
			<RecipeTitleField recipe={recipe} />
			<H2>Ingredients</H2>
			<RecipeIngredientsEditor recipe={recipe} />
			<H2>Instructions</H2>
			<RecipeInstructionsField recipe={recipe} />
		</Box>
	);
}
