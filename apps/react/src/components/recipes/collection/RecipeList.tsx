import { Link } from '@/components/nav/Link.jsx';
import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Box } from '@aglio/ui/components/box';
import { Button } from '@aglio/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
} from '@aglio/ui/components/dropdownMenu';
import { InfiniteLoadTrigger } from '@aglio/ui/components/infiniteLoadTrigger';
import { PageFixedArea } from '@aglio/ui/components/layouts';
import { Spinner } from '@aglio/ui/src/components/spinner';
import { sprinkles } from '@aglio/ui/styles';
import {
	DotsVerticalIcon,
	PlusCircledIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { Suspense } from 'react';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import * as classes from './RecipeList.css.js';
import { RecipeListActions } from './RecipeListActions.jsx';
import { useFilteredRecipes } from './hooks.js';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<div className={classes.root}>
			<div className={classes.topRow}>
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
				<RecipeCollectionMenu />
			</div>
			<Suspense>
				<PageFixedArea>
					<RecipeSearchBar className={classes.searchBar} />
					<RecipeListActions />
				</PageFixedArea>
			</Suspense>
			<Suspense
				fallback={
					<div className={classes.list}>
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
					</div>
				}
			>
				<RecipeListContent />
			</Suspense>
		</div>
	);
}

function RecipeListContent() {
	const [recipes, { loadMore, hasMore }] = useFilteredRecipes();

	if (!recipes.length) {
		return <EmptyState />;
	}

	return (
		<>
			<div className={classes.list}>
				{recipes.map((recipe) => (
					<RecipeListItem key={recipe.get('id')} recipe={recipe} />
				))}
			</div>
			{hasMore && (
				<InfiniteLoadTrigger
					onVisible={loadMore}
					className={sprinkles({ mt: 6, width: 'full' })}
				>
					<Spinner />
				</InfiniteLoadTrigger>
			)}
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
					<Suspense>
						<RecipeTagsViewer recipe={recipe} />
					</Suspense>
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

function RecipePlaceholderItem() {
	return <Box className={classes.item}>&nbsp;</Box>;
}
