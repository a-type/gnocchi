import { hooks, Recipe } from '@/stores/recipes/index.js';

export interface RecipeIngredientsViewerProps {
	recipe: Recipe;
}

export function RecipeIngredientsViewer({
	recipe,
}: RecipeIngredientsViewerProps) {
	const ingredients = recipe.get('ingredients');
	hooks.useWatch(ingredients);

	return (
		<ul>
			{ingredients.map((ingredient) => (
				<li key={ingredient.get('id')}>{ingredient.get('text')}</li>
			))}
		</ul>
	);
}
