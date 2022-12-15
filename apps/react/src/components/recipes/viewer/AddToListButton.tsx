import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/primitives/Dialog.jsx';
import { Button, Checkbox } from '@/components/primitives/index.js';
import { hooks, Recipe } from '@/stores/recipes/index.js';
import { useState } from 'react';
import { clsx } from 'clsx';
import * as classes from './AddToListButton.css.js';
import { groceries } from '@/stores/groceries/index.js';
import { groceriesState } from '@/components/groceries/state.js';

export interface AddToListButtonProps {
	recipe: Recipe;
}

export function AddToListButton({ recipe }: AddToListButtonProps) {
	const { ingredients } = hooks.useWatch(recipe);
	const [adding, setAdding] = useState(false);
	const [checkedItems, setCheckedItems] = useState<boolean[]>(() => {
		return new Array(ingredients.length).fill(true);
	});
	const items = hooks.useWatch(ingredients);

	return (
		<Dialog open={adding} onOpenChange={setAdding}>
			<DialogTrigger asChild>
				<Button color="primary">Add to list</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Add to list</DialogTitle>
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
							<label>{ingredient.get('text')}</label>
						</li>
					))}
				</ul>
				<div className={classes.actions}>
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<Button
						color="primary"
						onClick={() => {
							groceries.addItems(
								items
									.filter((_, index) => checkedItems[index])
									.map((item) => item.get('text')),
								{
									sourceInfo: {
										title: recipe.get('title'),
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
				</div>
			</DialogContent>
		</Dialog>
	);
}
