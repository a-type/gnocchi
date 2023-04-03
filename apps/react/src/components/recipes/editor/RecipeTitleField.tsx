import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import * as classes from './RecipeTitleField.css.js';

export interface RecipeTitleFieldProps {
	recipe: Recipe;
}

export function RecipeTitleField({ recipe }: RecipeTitleFieldProps) {
	const title = hooks.useWatch(recipe, 'title');

	return (
		<LiveUpdateTextField
			textArea
			value={title}
			onChange={(value) => {
				recipe.update({
					title: value,
					updatedAt: Date.now(),
				});
			}}
			className={classes.root}
		/>
	);
}
