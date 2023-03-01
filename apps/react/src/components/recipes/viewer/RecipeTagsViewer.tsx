import { TagIcon } from '@/components/icons/TagIcon.jsx';
import { ThemeName } from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { themeMap } from '@aglio/ui';
import { Recipe } from '@aglio/groceries-client';
import classnames from 'classnames';
import * as classes from './RecipeTagsViewer.css.js';
import { Icon } from '@/components/icons/Icon.jsx';

export interface RecipeTagsViewerProps {
	recipe: Recipe;
}

export function RecipeTagsViewer({ recipe }: RecipeTagsViewerProps) {
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	if (!tags) return null;

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
			<span>{data?.get('icon') ?? <Icon name="tag" />}</span>
			<span>{tag}</span>
		</div>
	);
}
