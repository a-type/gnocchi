import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@aglio/ui/src/components/button';
import { useNavigate } from '@lo-fi/react-router';

export function RecipeCreateButton() {
	const navigate = useNavigate();
	const client = hooks.useClient();

	return (
		<Button
			onClick={async () => {
				const recipe = await client.recipes.put({});
				navigate(makeRecipeLink(recipe, '/edit'), {
					skipTransition: true,
				});
			}}
			color="primary"
		>
			New Recipe
		</Button>
	);
}
