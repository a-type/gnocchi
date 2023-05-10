import { Recipe } from '@aglio/groceries-client';
import { useSyncedInstructionsEditor } from '../hooks.js';
import * as classes from './RecipeInstructionsViewer.css.js';
import { RichEditor } from '@aglio/ui/components/richEditor';
import classNames from 'classnames';

export interface RecipeInstructionsViewerProps {
	recipe: Recipe;
	className?: string;
}

export function RecipeInstructionsViewer({
	recipe,
	className,
}: RecipeInstructionsViewerProps) {
	const editor = useSyncedInstructionsEditor({ recipe, readonly: true });
	return (
		<RichEditor
			className={classNames(classes.root, className)}
			editor={editor}
		/>
	);
}
