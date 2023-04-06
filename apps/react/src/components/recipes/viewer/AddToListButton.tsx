import { groceriesState } from '@/components/groceries/state.js';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import * as classes from './AddToListButton.css.js';
import { MultiplierStepper } from './MultiplierStepper.jsx';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { Checkbox } from '@aglio/ui/components/checkbox';
import { sprinkles } from '@aglio/ui/styles';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';

export interface AddToListButtonProps extends ButtonProps {
	recipe: Recipe;
}

export function AddToListButton({
	recipe,
	children,
	...rest
}: AddToListButtonProps) {
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
	useEffect(() => {
		if (adding) {
			setMultiplier(defaultMultiplier);
		}
	}, [adding]);

	const addItems = hooks.useAddItems();

	return (
		<OnboardingTooltip
			content={
				<div>Use this button to add ingredients to your grocery list.</div>
			}
			onboarding={saveHubRecipeOnboarding}
			step="addToList"
			disableNext
			// prevent interactions inside the dialog
			// from skipping the step
			ignoreOutsideInteraction={(el) => !!el.closest('role="dialog"')}
		>
			<div>
				<Dialog open={adding} onOpenChange={setAdding}>
					<DialogTrigger asChild>
						<Button color="default" {...rest}>
							{children || 'Add to list'}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle>Add to list</DialogTitle>
						<div className={classes.mainContent}>
							<RecipeNote recipe={recipe} readOnly />
							<MultiplierStepper
								highlightChange
								value={multiplier}
								onChange={setMultiplier}
							/>
							<ul className={classes.checklist}>
								{items.map((ingredient, index) => {
									const isSectionHeader = ingredient.get('isSectionHeader');
									return (
										<li key={index} className={classes.item}>
											<Checkbox
												checked={checkedItems[index]}
												onCheckedChange={(checked) => {
													setCheckedItems((prev) => {
														const next = [...prev];
														next[index] = checked === true;
														return next;
													});
												}}
												className={isSectionHeader ? classes.hidden : undefined}
												disabled={isSectionHeader}
												id={`ingredient-${index}`}
											/>
											<label
												htmlFor={`ingredient-${index}`}
												className={classNames(
													classes.itemContent,
													isSectionHeader ? classes.sectionHeader : undefined,
												)}
											>
												<RecipeIngredientViewer
													ingredient={ingredient}
													multiplier={multiplier}
													className={sprinkles({ width: 'full' })}
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
											.filter((_, index) => checkedItems[index])
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
										},
									);
									groceriesState.justAddedRecipe = true;
									setTimeout(() => {
										groceriesState.justAddedRecipe = false;
									}, 100);
									setAdding(false);
									next();
								}}
							>
								Add
							</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
			</div>
		</OnboardingTooltip>
	);
}
