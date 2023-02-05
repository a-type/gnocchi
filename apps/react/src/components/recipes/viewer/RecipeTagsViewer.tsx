import { TagIcon } from '@/components/icons/TagIcon.jsx';
import { ThemeName } from '@/components/primitives/index.js';
import { hooks } from '@/stores/groceries/index.js';
import { themeMap } from '@/styles/themes/map.js';
import { Recipe } from '@aglio/groceries-client';
import classnames from 'classnames';
import * as classes from './RecipeTagsViewer.css.js';

export interface RecipeTagsViewerProps {
	recipe: Recipe;
}

export function RecipeTagsViewer({ recipe }: RecipeTagsViewerProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	return (
		<div className={classes.list}>
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
		<div
			className={classnames(
				classes.tag,
				data?.get('color') && themeMap[data.get('color') as ThemeName],
			)}
		>
			<span>{data?.get('icon') ?? <TagIcon />}</span>
			<span>{tag}</span>
		</div>
	);
}
