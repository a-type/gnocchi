import { hooks, Recipe } from '@/stores/recipes/index.js';
import { IngredientText } from './IngredientText.jsx';

export interface RecipeIngredientsViewerProps {
	recipe: Recipe;
}

export function RecipeIngredientsViewer({
	recipe,
}: RecipeIngredientsViewerProps) {
	const { multiplier } = hooks.useWatch(recipe);
	const ingredients = recipe.get('ingredients');
	hooks.useWatch(ingredients);

	return (
		<ul>
			{ingredients.map((ingredient) => (
				<li key={ingredient.get('id')}>
					<IngredientText ingredient={ingredient} multiplier={multiplier} />
				</li>
			))}
		</ul>
	);
}
