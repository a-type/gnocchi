import { hooks } from '@/stores/groceries/index.js';
import addHours from 'date-fns/addHours';

const sixHoursAgo = addHours(new Date(), -6);

export function useNowPlayingRecipes() {
	const activeRecipes = hooks.useAllRecipes({
		index: {
			where: 'sessionStartedAt',
			gt: sixHoursAgo.getTime(),
		},
	});

	const myPresence = hooks.useSelf().presence;

	const firstRecipe = myPresence.viewingRecipeId
		? activeRecipes.find(
				(recipe) => recipe.get('id') === myPresence.viewingRecipeId,
		  ) ?? activeRecipes[0]
		: activeRecipes[0];
	const otherRecipes = activeRecipes.filter(
		(recipe) => recipe.get('id') !== firstRecipe.get('id'),
	);

	return {
		firstRecipe,
		otherRecipes,
	};
}
