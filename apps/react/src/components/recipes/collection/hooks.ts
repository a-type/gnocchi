import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

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
