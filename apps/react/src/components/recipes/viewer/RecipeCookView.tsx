import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { clsx } from 'clsx';
import * as classes from './RecipeCookView.css.js';
import { H1 } from '@/components/primitives/index.js';
import { useEffect } from 'react';
import { hooks } from '@/stores/groceries/index.js';
import { CookingToolbar } from './CookingToolbar.jsx';
import { CookingActionBar } from './CookingActionBar.jsx';
import { PageFixedArea } from '@/components/layouts/index.jsx';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { InstructionsProvider } from '../editor/InstructionStepNodeView.jsx';
import { useCookingRecipe } from './RecipeCookContext.jsx';

export interface RecipeCookViewProps {
	slug: string;
	className?: string;
}

export function RecipeCookView({ className }: { className?: string }) {
	const recipe = useCookingRecipe();
	return (
		<div className={clsx(classes.container, className)}>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<PageFixedArea className={sprinkles({ px: 0, py: 1 })}>
				<CookingActionBar recipe={recipe} />
			</PageFixedArea>
			<InstructionsProvider isEditing={false} recipeId={recipe.get('id')}>
				<RecipeInstructionsViewer recipe={recipe} />
			</InstructionsProvider>
			<CookingToolbar recipe={recipe} />
		</div>
	);
}
