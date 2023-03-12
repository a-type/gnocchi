import { hooks } from '@/stores/groceries/index.js';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
	Button,
	Box,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
} from '@aglio/ui';
import * as classes from './RecipeList.css.js';
import { sprinkles } from '@aglio/ui';
import { Recipe } from '@aglio/groceries-client';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Suspense } from 'react';
import { RecipeListActions } from './RecipeListActions.jsx';
import { PageFixedArea } from '@aglio/ui';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { useRecipeTagFilter } from './hooks.js';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import {
	DotsVerticalIcon,
	PlusCircledIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<div className={classes.root}>
			<Suspense
				fallback={
					<Button
						color="primary"
						className={sprinkles({ alignSelf: 'flex-start' })}
					>
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
			<div className={classes.list}>
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
			</div>
		</div>
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
				.sort((a, b) => b.get('updatedAt') - a.get('updatedAt'))
				.map((recipe) => (
					<RecipeListItem key={recipe.get('id')} recipe={recipe} />
				))}
		</>
	);
}

function RecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);

	const deleteRecipe = hooks.useDeleteRecipe();

	return (
		<div className={classes.item}>
			<Link className={classes.itemContent} to={makeRecipeLink(recipe)}>
				<div className={classes.itemTitle}>
					<span>{title}</span>
					<div className={classes.tags}>
						<RecipeTagsViewer recipe={recipe} />
					</div>
				</div>
				<RecipeMainImageViewer recipe={recipe} className={classes.itemImage} />
			</Link>
			<div className={classes.itemActions}>
				<div className={classes.itemActionsStart}>
					<AddToListButton recipe={recipe} color="ghost" size="icon">
						<PlusCircledIcon />
					</AddToListButton>
				</div>
				<div className={classes.itemActionsEnd}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" color="ghost">
								<DotsVerticalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								color="destructive"
								onSelect={() => deleteRecipe(recipe.get('id'))}
							>
								<span>Delete</span>
								<DropdownMenuItemRightSlot>
									<TrashIcon />
								</DropdownMenuItemRightSlot>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
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
			className={sprinkles({ alignSelf: 'flex-start' })}
		>
			Create New
		</Button>
	);
}

function RecipePlaceholderItem() {
	return <Box className={classes.item}>&nbsp;</Box>;
}
