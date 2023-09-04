import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import classNames from 'classnames';
import { Icon } from '@/components/icons/Icon.jsx';
import { RecipeTagMenuWrapper } from '@/components/recipes/tags/RecipeTagMenuWrapper.jsx';

export interface RecipeTagsViewerProps {
	recipe: Recipe;
	limit?: number;
	className?: string;
}

export function RecipeTagsViewer({
	recipe,
	limit,
	className,
}: RecipeTagsViewerProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	if (!tags) return null;

	let tagsToDisplay = limit ? tags.getSnapshot().slice(0, limit) : tags;

	return (
		<div className={classNames('flex flex-wrap gap-1 text-sm', className)}>
			{tagsToDisplay.map((tag) => (
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
					'flex flex-row items-center gap-1 px-3 py-1 rounded-full bg-primaryLight color-black font-bold',
					data?.get('color') && `theme-${data.get('color')}`,
				)}
			>
				<span>
					{data?.get('icon') ?? (
						<Icon name="tag" className="w-1em h-1em relative top-0.1em" />
					)}
				</span>
				<span>{tag}</span>
			</div>
		</RecipeTagMenuWrapper>
	);
}
