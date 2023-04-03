import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { sprinkles } from '@aglio/ui/styles';
import {
	DotsVerticalIcon,
	PlusCircledIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import * as classes from './RecipeList.css.js';
import { RecipeListActions } from './RecipeListActions.jsx';
import { useRecipeTagFilter } from './hooks.js';
import { Button } from '@aglio/ui/components/button';
import { PageFixedArea } from '@aglio/ui/components/layouts';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
} from '@aglio/ui/components/dropdownMenu';
import { Box } from '@aglio/ui/components/box';

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
				<div className={classes.tags}>
					<RecipeTagsViewer recipe={recipe} />
				</div>
				<div className={classes.itemTitle}>
					<span>{title}</span>
				</div>
			</Link>
			<RecipeMainImageViewer recipe={recipe} className={classes.itemImage} />
			<div className={classes.itemActions}>
				<div className={classes.itemActionsStart}>
					<AddToListButton
						recipe={recipe}
						color="ghost"
						size="icon"
						className={classes.itemActionButton}
					>
						<PlusCircledIcon className={classes.actionIcon} />
					</AddToListButton>
				</div>
				<div className={classes.itemActionsEnd}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								color="ghost"
								className={classes.itemActionButton}
							>
								<DotsVerticalIcon className={classes.actionIcon} />
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
