import { Button } from '@aglio/ui/components/button';
import { hooks } from '@/stores/groceries/index.js';
import { useNavigate } from 'react-router-dom';
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
