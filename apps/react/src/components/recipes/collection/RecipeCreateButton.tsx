import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { hooks } from '@/stores/groceries/index.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import { useNavigate } from '@verdant-web/react-router';

export function RecipeCreateButton({ children, ...rest }: ButtonProps) {
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
			{...rest}
		>
			{children || 'New Recipe'}
		</Button>
	);
}
