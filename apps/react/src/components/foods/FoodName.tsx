import { hooks } from '@/stores/groceries/index.js';
import { Food } from '@aglio/groceries-client';
import { capitalize } from '@aglio/tools';
import pluralize from 'pluralize';

export interface FoodNameProps {
	food: Food;
}

export function useFoodName(food: Food | null, backupName?: string) {
	hooks.useWatch(food);

	if (!food) {
		return backupName || '';
	}

	const pluralizeName = food.get('pluralizeName');
	const canonicalName = food.get('canonicalName');

	return capitalize(pluralizeName ? pluralize(canonicalName) : canonicalName);
}

export function FoodName({ food }: FoodNameProps) {
	const name = useFoodName(food);
	return <>{name}</>;
}

export function useLookupFoodName(foodName: string) {
	const food = hooks.useOneFood({
		index: {
			where: 'nameLookup',
			equals: foodName,
		},
	});

	return useFoodName(food, foodName);
}

export function LookupFoodName({ foodName }: { foodName: string }) {
	return <>{useLookupFoodName(foodName)}</>;
}
