import { LiveUpdateTextField } from '@/components/primitives/LiveUpdateTextField.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { clsx } from 'clsx';
import * as classes from './RecipeTitleField.css.js';

export interface RecipeTitleFieldProps {
	recipe: Recipe;
}

export function RecipeTitleField({ recipe }: RecipeTitleFieldProps) {
	const title = hooks.useWatch(recipe, 'title');

	return (
		<LiveUpdateTextField
			value={title}
			onChange={(value) => {
				recipe.set('title', value);
			}}
			className={classes.root}
		/>
	);
}
