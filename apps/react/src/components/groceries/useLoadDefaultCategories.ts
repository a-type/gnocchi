import { groceries, hooks } from '@/stores/groceries/index.js';
import { trpcClient } from '@/trpc.js';
import { useEffect } from 'react';

/**
 * Initializes the default categories if no categories exist.
 */
export function useLoadDefaultCategories() {
	const categories = hooks.useAllCategories();
	const hasNoCategories = categories?.length === 0;
	useEffect(() => {
		if (hasNoCategories) {
			trpcClient.query('categories.defaults', null).then((categories) => {
				for (const category of categories) {
					groceries.get('categories').create({
						id: category.id,
						name: category.name,
					});
				}
			});

			// also load default assignments
			groceries.syncDefaultFoodAssignments();
		}
	}, [hasNoCategories]);
}
