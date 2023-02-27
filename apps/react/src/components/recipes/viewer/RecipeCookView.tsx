import { H1, PageFixedArea, sprinkles } from '@aglio/ui';
import { clsx } from 'clsx';
import { InstructionsProvider } from '../editor/InstructionStepNodeView.jsx';
import { useWatchChanges } from '../hooks.js';
import { CookingActionBar } from './CookingActionBar.jsx';
import { CookingToolbar } from './CookingToolbar.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';
import * as classes from './RecipeCookView.css.js';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { AddImagePrompt } from './AddImagePrompt.jsx';

export interface RecipeCookViewProps {
	slug: string;
	className?: string;
}

export function RecipeCookView({ className }: { className?: string }) {
	const recipe = useCookingRecipe();
	useWatchChanges(recipe);
	return (
		<div className={clsx(classes.container, className)}>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<PageFixedArea className={sprinkles({ px: 0, py: 1 })}>
				<CookingActionBar recipe={recipe} />
			</PageFixedArea>
			<InstructionsProvider
				isEditing={false}
				showTools
				recipeId={recipe.get('id')}
			>
				<RecipeInstructionsViewer recipe={recipe} />
			</InstructionsProvider>
			<AddImagePrompt recipe={recipe} />
			<CookingToolbar recipe={recipe} />
		</div>
	);
}
