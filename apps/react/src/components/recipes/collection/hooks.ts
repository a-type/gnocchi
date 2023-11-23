import { useCallback } from 'react';
import { useSearchParams } from '@verdant-web/react-router';
import { hooks } from '@/stores/groceries/index.js';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';

export function useRecipeTagFilter() {
	const [params, setParams] = useSearchParams();
	const tag = params.get('tag');

	const setTag = useCallback(
		(tag: string | null) => {
			if (tag) {
				setParams((params) => {
					params.set('tag', tag);
					return params;
				});
			} else {
				setParams((params) => {
					params.delete('tag');
					return params;
				});
			}
		},
		[setParams],
	);

	return [tag, setTag] as const;
}

export function useRecipeFoodFilter() {
	const [params, setParams] = useSearchParams();
	const food = params.get('food');

	const setFood = useCallback(
		(food: string | null) => {
			if (food) {
				setParams((params) => {
					params.set('food', food);
					return params;
				});
			} else {
				setParams((params) => {
					params.delete('food');
					return params;
				});
			}
		},
		[setParams],
	);

	return [food, setFood] as const;
}

export function useRecipeTitleFilter() {
	const [params, setParams] = useSearchParams();
	const value = params.get('search') || '';

	const setValue = useCallback(
		(value: string | null) => {
			if (value) {
				setParams((params) => {
					params.set('search', value);
					return params;
				});
			} else {
				setParams((params) => {
					params.delete('search');
					return params;
				});
			}
		},
		[setParams],
	);

	return [value, setValue] as const;
}

export function useIsFiltered() {
	const [tagFilter] = useRecipeTagFilter();
	const [foodFilter] = useRecipeFoodFilter();
	const [titleFilter] = useRecipeTitleFilter();

	return !!tagFilter || !!foodFilter || !!titleFilter;
}

export function useFilteredRecipes() {
	const [tagFilter] = useRecipeTagFilter();
	const [foodFilter] = useRecipeFoodFilter();
	const [titleFilter] = useRecipeTitleFilter();

	// just in... 'case'
	const normalizedTagFilter = tagFilter?.toLowerCase().trim();
	const normalizedFoodFilter = foodFilter?.toLowerCase().trim();
	const normalizedTitleFilter = titleFilter?.toLowerCase().trim();

	const [rawRecipes, meta] = hooks.useAllRecipesInfinite(
		normalizedTitleFilter
			? {
					index: {
						where: 'titleMatch',
						startsWith: normalizedTitleFilter,
					},
					key: 'recipesByTitleMatch',
			  }
			: normalizedFoodFilter
			? {
					index: {
						where: 'food',
						equals: normalizedFoodFilter,
					},
					key: 'recipesByFood',
			  }
			: normalizedTagFilter
			? {
					index: {
						where: 'tag',
						equals: normalizedTagFilter,
					},
					key: 'recipesByTag',
			  }
			: {
					key: 'recipes',
					index: {
						where: 'updatedAt',
						order: 'desc',
					},
			  },
	);

	// filter for the un-indexed filters
	const recipes = rawRecipes.filter((recipe) => {
		// a tag filter exists, but another filter took precedence
		if (
			normalizedTagFilter &&
			(normalizedFoodFilter || normalizedTitleFilter)
		) {
			if (
				!recipe
					.get('tags')
					.getSnapshot()
					.some((tag) => tag.toLowerCase() === normalizedTagFilter)
			)
				return false;
		}

		// a food filter exists, but another filter took precedence
		if (normalizedFoodFilter && normalizedTitleFilter) {
			if (
				!recipe
					.get('ingredients')
					.getSnapshot()
					.some(
						(ingredient) =>
							ingredient.food &&
							ingredient.food.toLowerCase() === normalizedFoodFilter,
					)
			)
				return false;
		}

		return true;
	});

	return [recipes, meta] as const;
}
