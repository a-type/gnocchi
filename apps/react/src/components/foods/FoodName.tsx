import { useLookupFoodByName } from '@/components/foods/lookup.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Food } from '@aglio/groceries-client';
import { capitalize } from '@aglio/tools';
import pluralize from 'pluralize';

export interface FoodNameProps {
	food: Food;
	capitalize?: boolean;
}

export function useFoodName(food: Food | null, backupName?: string) {
	hooks.useWatch(food);

	if (!food) {
		return backupName || '';
	}

	const pluralizeName = food.get('pluralizeName');
	const canonicalName = food.get('canonicalName');

	return pluralizeName ? pluralize(canonicalName) : canonicalName;
}

export function FoodName({ food, capitalize: doCapitalize }: FoodNameProps) {
	const name = useFoodName(food);
	return <>{doCapitalize ? capitalize(name) : name}</>;
}

export function useLookupFoodName(foodName?: string | null) {
	const food = useLookupFoodByName(foodName ?? '', { skip: !foodName });

	return useFoodName(food, foodName ?? undefined);
}

export function LookupFoodName({
	foodName,
	capitalize: doCapitalize,
}: {
	foodName: string;
	capitalize?: boolean;
}) {
	const name = useLookupFoodName(foodName);
	return <>{doCapitalize ? capitalize(name) : name}</>;
}
