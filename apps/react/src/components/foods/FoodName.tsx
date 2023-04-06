import { hooks } from '@/stores/groceries/index.js';
import { Food } from '@aglio/groceries-client';
import { capitalize } from '@aglio/tools';
import pluralize from 'pluralize';

export interface FoodNameProps {
	food: Food;
}

export function FoodName({ food }: FoodNameProps) {
	const { canonicalName, pluralizeName } = hooks.useWatch(food);

	return (
		<>{capitalize(pluralizeName ? pluralize(canonicalName) : canonicalName)}</>
	);
}
