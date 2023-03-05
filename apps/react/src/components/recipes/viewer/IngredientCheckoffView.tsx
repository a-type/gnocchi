import { Checkbox } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe, RecipeIngredientsItem } from '@aglio/groceries-client';
import { forwardRef } from 'react';
import { useCurrentRecipeSession } from '../hooks.js';
import classnames from 'classnames';
import * as classes from './IngredientCheckoffView.css.js';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';

export interface IngredientCheckoffViewProps {
	recipe: Recipe;
	className?: string;
}

export const IngredientCheckoffView = forwardRef<
	HTMLUListElement,
	IngredientCheckoffViewProps
>(function IngredientCheckoffView({ recipe, className }, ref) {
	const session = useCurrentRecipeSession(recipe);
	const { completedIngredients } = hooks.useWatch(session);
	hooks.useWatch(completedIngredients);
	const { ingredients, multiplier } = hooks.useWatch(recipe);
	hooks.useWatch(ingredients);

	return (
		<ul ref={ref} className={classnames(classes.list, className)}>
			{ingredients.map((ingredient) => (
				<IngredientCheckoffItem
					key={ingredient.get('id')}
					ingredient={ingredient}
					multiplier={multiplier}
					checked={completedIngredients.has(ingredient.get('id'))}
					onCheckedChange={(checked) => {
						if (checked) {
							completedIngredients.add(ingredient.get('id'));
						} else {
							completedIngredients.removeAll(ingredient.get('id'));
						}
					}}
				/>
			))}
		</ul>
	);
});

function IngredientCheckoffItem({
	ingredient,
	onCheckedChange,
	checked,
	multiplier,
}: {
	ingredient: RecipeIngredientsItem;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	multiplier?: number;
}) {
	const isSectionHeader = hooks.useWatch(ingredient, 'isSectionHeader');
	return (
		<li className={classnames(classes.item, checked && classes.itemChecked)}>
			{!isSectionHeader && (
				<Checkbox
					checked={checked}
					onCheckedChange={(checked) => onCheckedChange(checked === true)}
				/>
			)}
			<RecipeIngredientViewer
				className={classes.ingredientContent}
				ingredient={ingredient}
				multiplier={multiplier}
			/>
		</li>
	);
}
