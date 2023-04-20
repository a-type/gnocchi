import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddNotePrompt } from '@/components/recipes/viewer/AddNotePrompt.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { H1 } from '@aglio/ui/components/typography';
import classNames from 'classnames';
import { InstructionsProvider } from '../editor/InstructionStepNodeView.jsx';
import { useWatchChanges } from '../hooks.js';
import { AddImagePrompt } from './AddImagePrompt.jsx';
import { CookingActionBar } from './CookingActionBar.jsx';
import { CookingToolbar } from './CookingToolbar.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';
import * as classes from './RecipeCookView.css.js';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';

export interface RecipeCookViewProps {
	slug: string;
	className?: string;
}

export function RecipeCookView({ className }: { className?: string }) {
	const recipe = useCookingRecipe();
	useWatchChanges(recipe);
	return (
		<div className={classNames(classes.container, className)}>
			<HeaderBar backUrl={makeRecipeLink(recipe, '')}>
				<CookingActionBar recipe={recipe} />
			</HeaderBar>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<RecipeNote recipe={recipe} />
			<InstructionsProvider
				isEditing={false}
				showTools
				recipeId={recipe.get('id')}
			>
				<RecipeInstructionsViewer recipe={recipe} />
			</InstructionsProvider>
			<AddImagePrompt recipe={recipe} />
			<AddNotePrompt recipe={recipe} />
			<CookingToolbar recipe={recipe} />
		</div>
	);
}
