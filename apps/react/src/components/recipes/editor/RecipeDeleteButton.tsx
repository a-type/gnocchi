import { Button } from '@aglio/ui/components/button';
import { hooks } from '@/stores/groceries/index.js';
import { useNavigate } from '@lo-fi/react-router';
import { Recipe } from '@aglio/groceries-client';

export interface RecipeDeleteButtonProps {
	recipe: Recipe;
	className?: string;
}

export function RecipeDeleteButton({
	recipe,
	...rest
}: RecipeDeleteButtonProps) {
	const client = hooks.useClient();

	const navigate = useNavigate();

	return (
		<Button
			{...rest}
			color="destructive"
			onClick={() => {
				client.recipes.delete(recipe.get('id'));
				navigate('/recipes');
			}}
		>
			Delete
		</Button>
	);
}
