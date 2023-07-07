import { AddNotePrompt } from '@/components/recipes/cook/AddNotePrompt.jsx';
import classNames from 'classnames';
import { Suspense } from 'react';
import { InstructionsProvider } from '../editor/InstructionStepNodeView.jsx';
import { RecipeInstructionsViewer } from '../viewer/RecipeInstructionsViewer.jsx';
import { AddImagePrompt } from './AddImagePrompt.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';

export interface RecipeCookViewProps {
	className?: string;
	tab?: 'prep' | 'cook';
}

export function RecipeCookView({ className }: RecipeCookViewProps) {
	const recipe = useCookingRecipe();

	return (
		<div
			className={classNames(
				'w-full flex flex-col items-start pb-30vh gap-3',
				className,
			)}
		>
			<Suspense>
				<InstructionsProvider
					isEditing={false}
					showTools
					recipeId={recipe.get('id')}
				>
					<RecipeInstructionsViewer recipe={recipe} />
				</InstructionsProvider>
			</Suspense>
			<Suspense>
				<div className="w-full flex flex-col items-stretch mt-10 gap-3">
					<AddImagePrompt recipe={recipe} />
					<AddNotePrompt recipe={recipe} />
				</div>
			</Suspense>
		</div>
	);
}
