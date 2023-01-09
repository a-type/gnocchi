import { hooks } from '@/stores/groceries/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Box } from '@/components/primitives/index.js';
import * as classes from './RecipeList.css.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { Recipe } from '@aglio/groceries-client';
import { makeRecipeLink } from './makeRecipeLink.js';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	const recipes = hooks.useAllRecipes({
		index: {
			where: 'updatedAt',
			order: 'desc',
		},
	});

	return (
		<Box className={classes.list}>
			<RecipeCreateButton />
			{recipes.map((recipe) => (
				<RecipeListItem key={recipe.get('id')} recipe={recipe} />
			))}
		</Box>
	);
}

function RecipeListItem({ recipe }: { recipe: Recipe }) {
	const { slug, id, title } = hooks.useWatch(recipe);
	return (
		<Link className={classes.item} to={makeRecipeLink(recipe)}>
			{title}
		</Link>
	);
}

function RecipeCreateButton() {
	const navigate = useNavigate();
	const client = hooks.useClient();

	return (
		<Button
			onClick={async () => {
				const recipe = await client.recipes.put({});
				navigate(makeRecipeLink(recipe, '/edit'));
			}}
			color="primary"
			className={sprinkles({ alignSelf: 'start' })}
		>
			Create New
		</Button>
	);
}
