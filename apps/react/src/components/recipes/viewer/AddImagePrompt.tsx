import { AppearWithScroll } from '@/components/recipes/viewer/AppearWithScroll.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { ImageUploader } from '@aglio/ui/components/imageUploader';
import { P } from '@aglio/ui/components/typography';
import { useToggle } from '@aglio/ui/hooks';

export interface AddImagePromptProps {
	recipe: Recipe;
}

export function AddImagePrompt({ recipe }: AddImagePromptProps) {
	const { mainImage } = hooks.useWatch(recipe);
	const [show] = useToggle(!mainImage);

	if (!show) {
		return null;
	}

	return (
		<AppearWithScroll>
			<P>Enjoy! Now would be a good time to add a photo to this recipe 🙂</P>
			<ImageUploader
				value={mainImage?.url || null}
				onChange={(image) => {
					recipe.update({
						mainImage: image,
						updatedAt: Date.now(),
					});
				}}
				className="h-200px rounded-sm overflow-hidden"
				maxDimension={1080}
			/>
		</AppearWithScroll>
	);
}
