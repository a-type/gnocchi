import { hooks, RecipeIngredientsItem } from '@/stores/recipes/index.js';
import { fractionToText } from '@aglio/tools';
import pluralize from 'pluralize';

export interface IngredientTextProps {
	ingredient: RecipeIngredientsItem;
	multiplier: number;
}

export function IngredientText({
	ingredient,
	multiplier,
}: IngredientTextProps) {
	const { text, quantity, unit, food } = hooks.useWatch(ingredient);

	if (multiplier !== 1) {
		const finalQuantity = quantity * multiplier;
		return (
			<span>
				{fractionToText(finalQuantity)}{' '}
				{unit ? (finalQuantity <= 1 ? unit : pluralize(unit)) : ''} {food}
			</span>
		);
	}

	return <span>{text}</span>;
}
