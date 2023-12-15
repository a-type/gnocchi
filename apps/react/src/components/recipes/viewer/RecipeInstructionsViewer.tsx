import { Recipe } from '@aglio/groceries-client';
import { useSyncedInstructionsEditor } from '../hooks.js';
import { RichEditor } from '@a-type/ui/components/richEditor';
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
			className={classNames('max-w-600px w-full', className)}
			editor={editor}
			readOnly
		/>
	);
}
