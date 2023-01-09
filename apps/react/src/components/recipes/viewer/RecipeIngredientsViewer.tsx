import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { forwardRef } from 'react';
import { IngredientText } from './IngredientText.jsx';

export interface RecipeIngredientsViewerProps {
	recipe: Recipe;
}

export const RecipeIngredientsViewer = forwardRef<
	HTMLUListElement,
	RecipeIngredientsViewerProps
>(function RecipeIngredientsViewer({ recipe, ...rest }, ref) {
	const { multiplier } = hooks.useWatch(recipe);
	const ingredients = recipe.get('ingredients');
	hooks.useWatch(ingredients);

	return (
		<ul ref={ref}>
			{ingredients
				.filter((i) => !!i)
				.map((ingredient) => (
					<li key={ingredient.get('id')}>
						<IngredientText ingredient={ingredient} multiplier={multiplier} />
					</li>
				))}
		</ul>
	);
});
