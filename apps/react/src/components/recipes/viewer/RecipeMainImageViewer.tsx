import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import classNames from 'classnames';

export interface RecipeMainImageViewerProps {
	recipe: Recipe;
	className?: string;
}

export function RecipeMainImageViewer({
	recipe,
	className,
}: RecipeMainImageViewerProps) {
	const { mainImage } = hooks.useWatch(recipe);
	const src = hooks.useWatch(mainImage);

	return src ? (
		<img
			src={src}
			className={classNames(
				'w-full h-full overflow-hidden rounded-lg object-cover',
				className,
			)}
		/>
	) : null;
}
