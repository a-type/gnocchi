import { hooks } from '@/stores/groceries/index.js';
import { Recipe, RecipeIngredientsItem } from '@aglio/groceries-client';
import { forwardRef } from 'react';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';
import classNames from 'classnames';

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
		<ul ref={ref} className="pl-4 w-full">
			{ingredients
				.filter((i) => !!i)
				.map((ingredient) => (
					<IngredientViewerItem
						key={ingredient.get('id')}
						ingredient={ingredient}
						multiplier={multiplier}
					/>
				))}
		</ul>
	);
});

function IngredientViewerItem({
	ingredient,
	multiplier,
}: {
	ingredient: RecipeIngredientsItem;
	multiplier: number;
}) {
	const isSectionHeader = hooks.useWatch(ingredient, 'isSectionHeader');

	return (
		<li
			className={classNames('mb-3 w-full', {
				'list-none font-bold': isSectionHeader,
			})}
		>
			<RecipeIngredientViewer ingredient={ingredient} multiplier={multiplier} />
		</li>
	);
}
