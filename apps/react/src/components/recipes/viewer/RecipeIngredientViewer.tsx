import { RecipeIngredientsItem } from '@aglio/groceries-client';
import { IngredientText } from './IngredientText.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Note } from '@aglio/ui';
import classNames from 'classnames';
import * as classes from './RecipeIngredientViewer.css.js';

export interface RecipeIngredientViewerProps {
	ingredient: RecipeIngredientsItem;
	multiplier?: number;
}

export function RecipeIngredientViewer({
	ingredient,
	multiplier = 1,
}: RecipeIngredientViewerProps) {
	const note = hooks.useWatch(ingredient, 'note');
	return (
		<div className={classes.root}>
			<IngredientText multiplier={multiplier} ingredient={ingredient} />
			{note && <Note>{note}</Note>}
		</div>
	);
}
