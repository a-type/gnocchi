import { Recipe } from '@aglio/groceries-client';
import { groceriesState } from '@/components/groceries/state.js';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { MultiplierStepper } from './MultiplierStepper.jsx';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@aglio/ui/components/dialog';
import { Checkbox } from '@aglio/ui/components/checkbox';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { ActionBar, ActionButton } from '@aglio/ui/src/components/actions';
import { CheckboxIcon, SquareIcon } from '@radix-ui/react-icons';

export interface AddToListDialogProps {
	recipe: Recipe;
	listId?: string | null;
	children?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function AddToListDialog({
	recipe,
	children,
	listId,
	open,
	onOpenChange,
	...rest
}: AddToListDialogProps) {
	// set local multiplier from recipe default
	const { ingredients, multiplier: defaultMultiplier } = hooks.useWatch(recipe);
	const [multiplier, setMultiplier] = useState(defaultMultiplier);
	const [adding, setAdding] = useState(false);

	const [checkedItems, setCheckedItems] = useState<boolean[]>(() => {
		return new Array(ingredients.length).fill(false).map((_, i) => {
			return !ingredients.get(i).get('isSectionHeader');
		});
	});
	const items = hooks.useWatch(ingredients);
	const [_, next] = saveHubRecipeOnboarding.useStep('addToList');

	// because this component stays mounted... have to reset this...
	const isReallyOpen = open === undefined ? adding : open;
	const setIsReallyOpen = onOpenChange === undefined ? setAdding : onOpenChange;
	useEffect(() => {
		if (isReallyOpen) {
			setMultiplier(defaultMultiplier);
		}
	}, [isReallyOpen]);

	const addItems = hooks.useAddItems();

	return (
		<Dialog open={isReallyOpen} onOpenChange={setIsReallyOpen} {...rest}>
			{children}
			<DialogContent>
				<DialogTitle>Add to list</DialogTitle>
				<div className="flex flex-col items-start gap-3">
					<RecipeNote recipe={recipe} readOnly />
					<MultiplierStepper
						highlightChange
						value={multiplier}
						onChange={setMultiplier}
					/>
					<ActionBar>
						<ActionButton
							onClick={() => setCheckedItems((prev) => prev.map(() => true))}
							icon={<CheckboxIcon />}
						>
							Select all
						</ActionButton>
						<ActionButton
							onClick={() => setCheckedItems((prev) => prev.map(() => false))}
							icon={<SquareIcon />}
						>
							Select none
						</ActionButton>
					</ActionBar>
					<ul className="flex flex-col items-start list-none p-0 m-0 gap-3">
						{items.map((ingredient, index) => {
							const isSectionHeader = ingredient.get('isSectionHeader');
							return (
								<li
									key={index}
									className="flex flex-row items-start gap-2 w-full"
								>
									<Checkbox
										checked={checkedItems[index]}
										onCheckedChange={(checked) => {
											setCheckedItems((prev) => {
												const next = [...prev];
												next[index] = checked === true;
												return next;
											});
										}}
										className={
											isSectionHeader ? '[visibility:hidden]' : undefined
										}
										disabled={isSectionHeader}
										id={`ingredient-${index}`}
									/>
									<label
										htmlFor={`ingredient-${index}`}
										className={classNames(
											'flex-1',
											isSectionHeader ? 'font-bold' : undefined,
										)}
									>
										<RecipeIngredientViewer
											ingredient={ingredient}
											multiplier={multiplier}
											className="w-full"
											disableAddNote
										/>
									</label>
								</li>
							);
						})}
					</ul>
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<Button
						color="primary"
						onClick={() => {
							addItems(
								items
									.filter(
										(item, index) =>
											checkedItems[index] && !item.get('isSectionHeader'),
									)
									.map((item) =>
										multiplier
											? {
													original: item.get('text'),
													food: item.get('food') || 'Unknown',
													quantity: item.get('quantity') * multiplier,
													unit: item.get('unit'),
													comments: item.get('comments').getAll(),
											  }
											: item.get('text'),
									),
								{
									sourceInfo: {
										title: recipe.get('title'),
										multiplier,
										recipeId: recipe.get('id'),
									},
									listId,
								},
							);
							groceriesState.justAddedSomething = true;
							setAdding(false);
							onOpenChange?.(false);
							next();
						}}
					>
						Add
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
