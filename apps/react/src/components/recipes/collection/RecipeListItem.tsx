import { Link } from '@/components/nav/Link.jsx';
import { RecipeAddTag } from '@/components/recipes/editor/RecipeAddTag.jsx';
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
import {
	DotsVerticalIcon,
	PlayIcon,
	PlusCircledIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { Suspense, useState } from 'react';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import {
	CardMain,
	CardActions,
	CardFooter,
	CardImage,
	CardMenu,
	CardRoot,
	CardTitle,
} from '@aglio/ui/components/card';

export function RecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);

	const deleteRecipe = hooks.useDeleteRecipe();

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<CardRoot className="min-h-200px md:(h-30vh max-h-400px)">
			<CardMain asChild>
				<Link to={makeRecipeLink(recipe)} preserveQuery>
					<div className="text-md">
						<Suspense>
							<RecipeTagsViewer recipe={recipe} />
						</Suspense>
					</div>
					<CardTitle>
						<span>{title}</span>
					</CardTitle>
				</Link>
			</CardMain>
			<CardImage>
				<RecipeMainImageViewer recipe={recipe} className="w-full h-full" />
			</CardImage>
			<CardFooter>
				<CardActions>
					<AddToListButton recipe={recipe} color="ghost" size="small">
						<PlusCircledIcon className="w-20px h-20px" />
						<span>Add to List</span>
					</AddToListButton>
				</CardActions>
				<CardMenu>
					<DropdownMenu
						open={menuOpen}
						onOpenChange={(open) => {
							if (open) setMenuOpen(true);
						}}
					>
						<DropdownMenuTrigger asChild>
							<Button size="icon" color="ghost">
								<DotsVerticalIcon className="w-20px h-20px" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							onPointerDownOutside={() => setMenuOpen(false)}
						>
							<RecipeAddTag
								recipe={recipe}
								onAdd={() => {
									setMenuOpen(false);
								}}
							>
								<DropdownMenuItem>
									<span>Add Tag</span>
									<DropdownMenuItemRightSlot>
										<PlusIcon />
									</DropdownMenuItemRightSlot>
								</DropdownMenuItem>
							</RecipeAddTag>
							<DropdownMenuItem
								color="destructive"
								onSelect={() => {
									deleteRecipe(recipe.get('id'));
									setMenuOpen(false);
								}}
							>
								<span>Delete</span>
								<DropdownMenuItemRightSlot>
									<TrashIcon />
								</DropdownMenuItemRightSlot>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardMenu>
			</CardFooter>
		</CardRoot>
	);
}

export function RecipePlaceholderItem() {
	return (
		<CardRoot className="min-h-200px md:(h-30vh max-h-400px)">&nbsp;</CardRoot>
	);
}
