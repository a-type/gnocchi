import { AddNotePrompt } from '@/components/recipes/cook/AddNotePrompt.jsx';
import { Suspense } from 'react';
import { InstructionsProvider } from '../editor/InstructionStepNodeView.jsx';
import { RecipeInstructionsViewer } from '../viewer/RecipeInstructionsViewer.jsx';
import { AddImagePrompt } from './AddImagePrompt.jsx';
import { CookingToolbar } from './CookingToolbar.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';
import classNames from 'classnames';

export interface RecipeCookViewProps {
	className?: string;
	tab?: 'prep' | 'cook';
}

export function RecipeCookView({ className }: RecipeCookViewProps) {
	const recipe = useCookingRecipe();

	return (
		<div className={classNames('animate-fade-in-up', className)}>
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
				<AddImagePrompt recipe={recipe} />
				<AddNotePrompt recipe={recipe} />
				<CookingToolbar recipe={recipe} />
			</Suspense>
		</div>
	);
}
