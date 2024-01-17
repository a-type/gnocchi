import { hooks } from '@/stores/groceries/index.js';
import { depluralize } from '@aglio/conversion';
import { Food } from '@aglio/groceries-client';

export function useLookupFoodByName(
	name: string,
	{ skip }: { skip?: boolean } = {},
) {
	const matches = hooks.useAllFoods({
		index: {
			where: 'nameLookup',
			equals: name,
		},
		skip,
	});
	return pickBestNameMatch(matches, name);
}

/**
 * Assumes foods has already been matched by name index.
 */
export function pickBestNameMatch(
	foods: Food[],
	name: string,
	exactOnly = false,
): Food | null {
	const normalized = depluralize(name).toLowerCase();
	const exactCanonical = foods.find(
		(f) => f.get('canonicalName') === normalized,
	);
	if (exactCanonical) return exactCanonical;
	const exactAlternate = foods.find((f) =>
		f.get('alternateNames').find((n) => n === normalized),
	);
	if (exactAlternate) return exactAlternate;
	if (exactOnly) return null;
	return foods[0] || null;
}
