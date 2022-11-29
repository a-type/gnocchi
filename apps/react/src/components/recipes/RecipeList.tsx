import { hooks, Recipe } from '@/stores/recipes/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '../primitives/box/Box.jsx';
import { Button } from '../primitives/primitives.jsx';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	const recipes = hooks.useAllRecipes({
		index: {
			where: 'updatedAt',
			order: 'desc',
		},
	});

	return (
		<Box gap={4}>
			{recipes.map((recipe) => (
				<RecipeListItem key={recipe.get('id')} recipe={recipe} />
			))}
			<RecipeCreateButton />
		</Box>
	);
}

function RecipeListItem({ recipe }: { recipe: Recipe }) {
	const { slug, id, title } = hooks.useWatch(recipe);
	return <Link to={`/recipes/${slug}`}>{title}</Link>;
}

function RecipeCreateButton() {
	const navigate = useNavigate();
	const client = hooks.useStorage();

	return (
		<Button
			onClick={async () => {
				const recipe = await client.recipes.put({});
				navigate(`/recipes/${recipe.get('slug')}`);
			}}
		>
			Create New
		</Button>
	);
}
