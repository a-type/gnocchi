import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/primitives/index.js';
import { Button, Checkbox } from '@/components/primitives/index.js';
import { hooks, Recipe } from '@/stores/recipes/index.js';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import * as classes from './AddToListButton.css.js';
import { groceries } from '@/stores/groceries/index.js';
import { groceriesState } from '@/components/groceries/state.js';
import { IngredientText } from './IngredientText.jsx';
import { MultiplierStepper } from './MultiplierStepper.jsx';

export interface AddToListButtonProps {
	recipe: Recipe;
}

export function AddToListButton({ recipe }: AddToListButtonProps) {
	// set local multiplier from recipe default
	const { ingredients, multiplier: defaultMultiplier } = hooks.useWatch(recipe);
	const [multiplier, setMultiplier] = useState(defaultMultiplier);
	const [adding, setAdding] = useState(false);
	const [checkedItems, setCheckedItems] = useState<boolean[]>(() => {
		return new Array(ingredients.length).fill(true);
	});
	const items = hooks.useWatch(ingredients);

	// because this component stays mounted... have to reset this...
	useEffect(() => {
		if (adding) {
			setMultiplier(defaultMultiplier);
		}
	}, [adding]);

	return (
		<Dialog open={adding} onOpenChange={setAdding}>
			<DialogTrigger asChild>
				<Button color="default">Add to list</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Add to list</DialogTitle>
				<div className={classes.mainContent}>
					<MultiplierStepper
						highlightChange
						value={multiplier}
						onChange={setMultiplier}
					/>
					<ul className={classes.checklist}>
						{items.map((ingredient, index) => (
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
								/>
								<label>
									<IngredientText
										ingredient={ingredient}
										multiplier={multiplier}
									/>
								</label>
							</li>
						))}
					</ul>
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<Button
						color="primary"
						onClick={() => {
							groceries.addItems(
								items
									.filter((_, index) => checkedItems[index])
									.map((item) =>
										multiplier
											? {
													original: item.get('text'),
													food: item.get('food'),
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
						}}
					>
						Add
					</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
