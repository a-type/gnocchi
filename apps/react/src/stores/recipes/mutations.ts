import { parseIngredient } from '@aglio/conversion';
import { RecipeIngredientsItemInit } from './client/index.js';
import { RecipeIngredients } from './index.js';

export async function addIngredients(
	ingredients: RecipeIngredients,
	text: string,
) {
	const lines = text.split('\n');
	const parsed = lines
		.filter((line) => line.trim().length > 0)
		.map((line): RecipeIngredientsItemInit => {
			const parsedItem = parseIngredient(line);
			return {
				text: line,
				food: parsedItem.food,
				comments: parsedItem.comments,
				quantity: parsedItem.quantity,
				unit: parsedItem.unit,
			};
		});
	for (const item of parsed) {
		ingredients.push(item);
	}
}
