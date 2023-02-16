import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { ImageUploader } from '@aglio/ui';
import * as classes from './RecipeMainImageEditor.css.js';

export interface RecipeMainImageEditorProps {
	recipe: Recipe;
}

export function RecipeMainImageEditor({ recipe }: RecipeMainImageEditorProps) {
	const { mainImage } = hooks.useWatch(recipe);
	hooks.useWatch(mainImage);
	const enabled = useFeatureFlag('recipeImages');

	if (!enabled) return null;

	return (
		<ImageUploader
			className={classes.imageEditor}
			value={mainImage?.url ?? null}
			onChange={(file) => {
				recipe.set('mainImage', file);
			}}
		/>
	);
}
