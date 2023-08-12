import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import classNames from 'classnames';
import { Icon } from '@/components/icons/Icon.jsx';
import { ThemeName } from '@aglio/ui/components/colorPicker';
import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';

export interface RecipeTagsViewerProps {
	recipe: Recipe;
}

export function RecipeTagsViewer({ recipe }: RecipeTagsViewerProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	if (!tags) return null;

	return (
		<div className="flex flex-wrap gap-1">
			{tags.map((tag) => (
				<RecipeTagViewer key={tag} tag={tag} />
			))}
		</div>
	);
}

function RecipeTagViewer({ tag }: { tag: string }) {
	const data = hooks.useRecipeTagMetadata(tag);
	hooks.useWatch(data);

	return (
		<RecipeTagMenuWrapper tagName={tag}>
			<div
				className={classNames(
					'flex flex-row items-center gap-1 px-3 py-1 rounded-full bg-primaryLight color-black font-bold text-sm',
					data?.get('color') && `theme-${data.get('color')}`,
				)}
			>
				<span>{data?.get('icon') ?? <Icon name="tag" />}</span>
				<span>{tag}</span>
			</div>
		</RecipeTagMenuWrapper>
	);
}
