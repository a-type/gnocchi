import { Checkbox } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe, RecipeIngredientsItem } from '@aglio/groceries-client';
import { forwardRef } from 'react';
import { useCurrentRecipeSession } from '../hooks.js';
import classnames from 'classnames';
import * as classes from './IngredientCheckoffView.css.js';

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
	const { ingredients } = hooks.useWatch(recipe);
	hooks.useWatch(ingredients);

	return (
		<ul ref={ref} className={classnames(classes.list, className)}>
			{ingredients.map((ingredient) => (
				<IngredientCheckoffItem
					key={ingredient.get('id')}
					ingredient={ingredient}
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
}: {
	ingredient: RecipeIngredientsItem;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	const { text } = hooks.useWatch(ingredient);
	return (
		<li className={classnames(classes.item, checked && classes.itemChecked)}>
			<Checkbox
				checked={checked}
				onCheckedChange={(checked) => onCheckedChange(checked === true)}
			/>
			{text}
		</li>
	);
}
