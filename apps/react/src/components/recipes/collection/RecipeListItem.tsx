import { Link } from '@/components/nav/Link.jsx';
import { RecipeAddTag } from '@/components/recipes/editor/RecipeAddTag.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import {
	CardActions,
	CardFooter,
	CardImage,
	CardMain,
	CardMenu,
	CardRoot,
	CardTitle,
} from '@aglio/ui/components/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
} from '@aglio/ui/components/dropdownMenu';
import {
	Cross2Icon,
	DotsVerticalIcon,
	DrawingPinFilledIcon,
	DrawingPinIcon,
	Pencil1Icon,
	PlusCircledIcon,
	PlusIcon,
	TrashIcon,
} from '@radix-ui/react-icons';
import { Suspense, useCallback, useState } from 'react';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';

export function RecipeListItem({
	recipe,
	className,
}: {
	recipe: Recipe;
	className?: string;
}) {
	const { title, pinnedAt } = hooks.useWatch(recipe);

	const deleteRecipe = hooks.useDeleteRecipe();

	const [menuOpen, setMenuOpen] = useState(false);

	const togglePinned = useCallback(() => {
		if (recipe.get('pinnedAt')) {
			recipe.set('pinnedAt', null);
		} else {
			recipe.set('pinnedAt', Date.now());
		}
	}, [recipe]);

	const showPin = useFeatureFlag('pinnedRecipes');

	return (
		<CardRoot className={className}>
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
					{(showPin || pinnedAt) && (
						<Button
							size="icon"
							color={pinnedAt ? 'primary' : 'default'}
							onClick={togglePinned}
							className="relative"
						>
							<DrawingPinIcon
								className={pinnedAt ? 'relative top--2px left-0px' : undefined}
							/>
							{pinnedAt && (
								// slash through
								// <svg
								// 	className="absolute top-[50%] left-[50%] translate-[-50%] w-[15px] h-[15px] z-1"
								// 	viewBox="0 0 10 10"
								// >
								// 	<path
								// 		d="M 0 0 L 10 10"
								// 		stroke="currentColor"
								// 		strokeWidth="1"
								// 		strokeLinecap="round"
								// 		vectorEffect="non-scaling-stroke"
								// 	/>
								// </svg>
								<Cross2Icon className="absolute w-10px h-10px bottom-5px right-8px" />
							)}
						</Button>
					)}
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
							<DropdownMenuItem asChild>
								<Link to={makeRecipeLink(recipe, '/edit')} preserveQuery>
									<span>Edit</span>
									<DropdownMenuItemRightSlot>
										<Pencil1Icon />
									</DropdownMenuItemRightSlot>
								</Link>
							</DropdownMenuItem>
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

export function RecipePlaceholderItem({ className }: { className?: string }) {
	return <CardRoot className={className}>&nbsp;</CardRoot>;
}
