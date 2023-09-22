import { hooks } from '@/stores/groceries/index.js';
import { RecipeIngredientsItem } from '@aglio/groceries-client';
import { fractionToText } from '@aglio/tools';
import pluralize from 'pluralize';

export interface IngredientTextProps {
	ingredient: RecipeIngredientsItem;
	multiplier: number;
	className?: string;
}

export function IngredientText({
	ingredient,
	multiplier,
	className,
}: IngredientTextProps) {
	const { text, quantity, unit, food, comments } = hooks.useWatch(ingredient);

	if (multiplier !== 1) {
		const finalQuantity = quantity * multiplier;
		const showPlural = finalQuantity !== 1;
		return (
			<span className={className}>
				{fractionToText(finalQuantity)}{' '}
				{unit ? (showPlural ? pluralize(unit) : unit) : ''}{' '}
				{showPlural && !unit ? pluralize(food || '') : food}
				{comments.length > 0
					? `,
				${comments.map((comment) => comment).join(', ')}`
					: ''}
			</span>
		);
	}

	return <span className={className}>{replaceNumbersWithFractions(text)}</span>;
}

function replaceNumbersWithFractions(text: string) {
	// include decimals
	return text.replace(/(\d+\.\d+)/g, (match) =>
		fractionToText(parseFloat(match)),
	);
}
