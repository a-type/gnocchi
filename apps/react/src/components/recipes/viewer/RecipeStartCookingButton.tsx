import { LinkButton, LinkButtonProps } from '@/components/nav/Link.jsx';
import { useStartNewSessionIfNeeded } from '@/components/recipes/hooks.js';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Recipe } from '@aglio/groceries-client';
import { forwardRef } from 'react';

export interface RecipeStartCookingButtonProps
	extends Omit<LinkButtonProps, 'to'> {
	recipe: Recipe;
}

export const RecipeStartCookingButton = forwardRef<
	HTMLButtonElement,
	RecipeStartCookingButtonProps
>(function RecipeStartCookingButton({ recipe, ...rest }, ref) {
	const startSession = useStartNewSessionIfNeeded(recipe);
	return (
		<LinkButton
			color="primary"
			to={makeRecipeLink(recipe, '/cook/steps')}
			onClick={() => {
				startSession();
			}}
			{...rest}
		/>
	);
});
