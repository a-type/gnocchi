import { Button } from '@/components/primitives/index.js';
import { Recipe, hooks } from '@/stores/recipes/index.js';
import { useNavigate } from 'react-router-dom';

export interface RecipeDeleteButtonProps {
	recipe: Recipe;
}

export function RecipeDeleteButton({ recipe }: RecipeDeleteButtonProps) {
	const client = hooks.useClient();

	const navigate = useNavigate();

	return (
		<Button
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
