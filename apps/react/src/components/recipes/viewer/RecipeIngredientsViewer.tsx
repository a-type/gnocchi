import { hooks } from '@/stores/groceries/index.js';
import { Recipe, RecipeIngredientsItem } from '@aglio/groceries-client';
import { forwardRef } from 'react';
import { IngredientText } from './IngredientText.jsx';
import { Box, Note, sprinkles } from '@aglio/ui';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';
import classNames from 'classnames';
import * as classes from './RecipeIngredientsViewer.css.js';

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
		<ul
			ref={ref}
			className={sprinkles({
				pl: 4,
				width: 'full',
			})}
		>
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
			className={classNames(
				sprinkles({
					mb: 3,
					width: 'full',
				}),
				{
					[classes.sectionHeader]: isSectionHeader,
				},
			)}
		>
			<RecipeIngredientViewer ingredient={ingredient} multiplier={multiplier} />
		</li>
	);
}
