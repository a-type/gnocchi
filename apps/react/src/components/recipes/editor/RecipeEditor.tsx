import { Box } from '@/components/primitives/primitives.jsx';
import { hooks } from '@/stores/recipes/index.js';
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
		</Box>
	);
}
