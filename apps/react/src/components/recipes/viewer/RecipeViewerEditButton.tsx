import { LinkButton, LinkButtonProps } from '@aglio/ui';
import { Recipe } from '@aglio/groceries-client';
import { makeRecipeLink } from '../makeRecipeLink.js';

export interface RecipeViewerEditButtonProps
	extends Omit<LinkButtonProps, 'to'> {
	recipe: Recipe;
}

export function RecipeViewerEditButton({
	recipe,
	...rest
}: RecipeViewerEditButtonProps) {
	return (
		<LinkButton
			size="small"
			color="default"
			to={makeRecipeLink(recipe, '/edit')}
			{...rest}
		>
			Edit
		</LinkButton>
	);
}
