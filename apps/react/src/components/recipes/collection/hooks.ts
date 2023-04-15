import { useCallback } from 'react';
import { useSearchParams } from '@lo-fi/react-router';

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
