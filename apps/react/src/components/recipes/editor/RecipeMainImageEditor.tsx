import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { ImageUploader } from '@a-type/ui/components/imageUploader';

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
			className="w-full h-full rounded-lg"
			value={mainImage?.url ?? null}
			onChange={(file) => {
				recipe.update({
					mainImage: file,
					updatedAt: Date.now(),
				});
			}}
			maxDimension={1080}
			facingMode="environment"
		/>
	);
}
