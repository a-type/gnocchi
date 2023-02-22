import { hooks } from '@/stores/groceries/index.js';
import { RecipeIngredientsItem } from '@aglio/groceries-client';
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

	return <span>{replaceNumbersWithFractions(text)}</span>;
}

function replaceNumbersWithFractions(text: string) {
	// include decimals
	return text.replace(/(\d+\.\d+)/g, (match) =>
		fractionToText(parseFloat(match)),
	);
}
