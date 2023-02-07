import { hooks } from '@/stores/groceries/index.js';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Box } from '@aglio/ui';
import * as classes from './RecipeList.css.js';
import { sprinkles } from '@aglio/ui';
import { Recipe } from '@aglio/groceries-client';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Suspense } from 'react';
import { RecipeListActions } from './RecipeListActions.jsx';
import { PageFixedArea } from '@/components/layouts/index.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { useRecipeTagFilter } from './hooks.js';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<Box className={classes.list}>
			<Suspense
				fallback={
					<Button color="primary" className={sprinkles({ alignSelf: 'start' })}>
						Create New
					</Button>
				}
			>
				<RecipeCreateButton />
			</Suspense>
			<Suspense>
				<PageFixedArea>
					<RecipeListActions />
				</PageFixedArea>
			</Suspense>
			<Suspense
				fallback={
					<>
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
					</>
				}
			>
				<RecipeListContent />
			</Suspense>
		</Box>
	);
}

function RecipeListContent() {
	const [tagFilter] = useRecipeTagFilter();
	// just in... 'case'
	const normalizedTagFilter = tagFilter?.toLocaleLowerCase();
	const recipes = hooks.useAllRecipes(
		normalizedTagFilter
			? {
					index: {
						where: 'tag',
						equals: normalizedTagFilter,
					},
			  }
			: undefined,
	);

	return (
		<>
			{recipes
				.sort((a, b) => a.get('updatedAt') - b.get('updatedAt'))
				.map((recipe) => (
					<RecipeListItem key={recipe.get('id')} recipe={recipe} />
				))}
		</>
	);
}

function RecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);
	return (
		<Link className={classes.item} to={makeRecipeLink(recipe)}>
			<span>{title}</span>
			<div className={classes.tags}>
				<RecipeTagsViewer recipe={recipe} />
			</div>
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

function RecipePlaceholderItem() {
	return <Box className={classes.item}>&nbsp;</Box>;
}
