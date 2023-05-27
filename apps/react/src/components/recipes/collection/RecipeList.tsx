import { Link, LinkButton } from '@/components/nav/Link.jsx';
import { EmptyState } from '@/components/recipes/collection/EmptyState.jsx';
import { RecipeCollectionMenu } from '@/components/recipes/collection/RecipeCollectionMenu.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
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
import { withClassName } from '@aglio/ui/hooks';
import {
	DotsVerticalIcon,
	PlayIcon,
	PlusCircledIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { Suspense } from 'react';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { RecipeListActions } from './RecipeListActions.jsx';
import { useFilteredRecipes } from './hooks.js';
import { RecipeSearchBar } from '@/components/recipes/collection/RecipeSearchBar.jsx';
import { RecipeStartCookingButton } from '@/components/recipes/viewer/RecipeStartCookingButton.jsx';

export interface RecipeListProps {}

export function RecipeList({}: RecipeListProps) {
	return (
		<div className="flex flex-col gap-4 p-0 m-0">
			<div className="flex flex-row items-center justify-between">
				<Suspense
					fallback={
						<Button color="primary" className="self-start">
							Create New
						</Button>
					}
				>
					<RecipeCreateButton />
				</Suspense>
				<RecipeCollectionMenu />
			</div>
			<Suspense>
				<PageFixedArea className="pt-2">
					<RecipeSearchBar className="w-full" />
					<RecipeListActions />
				</PageFixedArea>
			</Suspense>
			<Suspense
				fallback={
					<List>
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
						<RecipePlaceholderItem />
					</List>
				}
			>
				<RecipeListContent />
			</Suspense>
		</div>
	);
}

const List = withClassName(
	'div',
	'grid grid-cols-[1fr] [grid-auto-rows:auto] gap-4 p-0 m-0 md:(grid-cols-[repeat(2,1fr)] [grid-auto-rows:1fr] items-end)',
);

function RecipeListContent() {
	const [recipes, { loadMore, hasMore }] = useFilteredRecipes();

	if (!recipes.length) {
		return <EmptyState />;
	}

	return (
		<>
			<List>
				{recipes.map((recipe) => (
					<RecipeListItem key={recipe.get('id')} recipe={recipe} />
				))}
			</List>
			{hasMore && (
				<InfiniteLoadTrigger onVisible={loadMore} className="mt-6 w-full">
					<Spinner />
				</InfiniteLoadTrigger>
			)}
		</>
	);
}

const Item = withClassName(
	'div',
	'flex flex-col border-light rounded-lg text-lg overflow-hidden h-max-content relative bg-gray1 min-h-200px md:(h-30vh max-h-400px)',
);

function RecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);

	const deleteRecipe = hooks.useDeleteRecipe();

	return (
		<Item>
			<Link
				className="flex flex-col gap-1 cursor-pointer transition p-4 pb-2 flex-1 relative z-1 hover:(bg-lightBlend color-black) md:pt-4"
				to={makeRecipeLink(recipe)}
				preserveQuery
			>
				<div className="text-md">
					<Suspense>
						<RecipeTagsViewer recipe={recipe} />
					</Suspense>
				</div>
				<div className="flex flex-col gap-1 mt-auto bg-white p-2 rounded-lg w-auto mr-auto border border-solid border-grayDarkBlend">
					<span>{title}</span>
				</div>
			</Link>
			<RecipeMainImageViewer
				recipe={recipe}
				className="absolute z-0 right-0 top-0 bottom-0 w-full h-full"
			/>
			<div className="flex flex-row p-2 bg-white relative z-1 border-0 border-t border-t-grayDarkBlend border-solid">
				<div className="ml-0 mr-auto flex flex-row gap-1 items-center">
					<RecipeStartCookingButton
						preserveQuery
						recipe={recipe}
						size="icon"
						color="primary"
					>
						<PlayIcon className="relative left-1px" />
					</RecipeStartCookingButton>
					<AddToListButton recipe={recipe} color="ghost" size="small">
						<PlusCircledIcon className="w-20px h-20px" />
						<span>Add to List</span>
					</AddToListButton>
				</div>
				<div className="mr-0 ml-auto flex flex-row gap-1 items-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" color="ghost">
								<DotsVerticalIcon className="w-20px h-20px" />
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
		</Item>
	);
}

function RecipePlaceholderItem() {
	return <Item>&nbsp;</Item>;
}
