import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';

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
			className="important:text-3xl max-w-full w-full"
		/>
	);
}
