import { Recipe } from '@aglio/groceries-client';
import { useSyncedPreludeEditor } from '../hooks.js';
import { Peek } from '@a-type/ui/components/peek';
import { RichEditor } from '@a-type/ui/components/richEditor';
import classNames from 'classnames';

export interface RecipePreludeViewerProps {
	recipe: Recipe;
}

export function RecipePreludeViewer({ recipe }: RecipePreludeViewerProps) {
	const editor = useSyncedPreludeEditor(recipe, true);

	return (
		<div className="w-full">
			<Peek>
				<RichEditor
					editor={editor}
					readOnly
					className={classNames(
						'[&_.ProseMirror_h1]:text-lg',
						'[&_.ProseMirror_h2]:(text-lg font-light)',
						'[&_.ProseMirror_h3]:(text-md)',
					)}
				/>
			</Peek>
		</div>
	);
}
