import { useWakeLock } from '@/hooks/useWakeLock.js';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { clsx } from 'clsx';
import * as classes from './RecipeCookView.css.js';
import { H1 } from '@/components/primitives/index.js';
import { useEffect } from 'react';
import { hooks } from '@/stores/groceries/index.js';
import { CookingToolbar } from './CookingToolbar.jsx';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { Recipe } from '@aglio/groceries-client';
import { CookingActionBar } from './CookingActionBar.jsx';
import { PageFixedArea } from '@/components/layouts/index.jsx';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { InstructionsProvider } from '../editor/InstructionStepNodeView.jsx';

export interface RecipeCookViewProps {
	slug: string;
	className?: string;
}

export function RecipeCookView({ slug, ...rest }: RecipeCookViewProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	if (!recipe) return <RecipeNotFound />;

	return <RecipeCookViewContent recipe={recipe} {...rest} />;
}

function RecipeCookViewContent({
	recipe,
	className,
}: {
	recipe: Recipe;
	className?: string;
}) {
	useWakeLock(true);

	const recipeId = recipe.get('id');
	const client = hooks.useClient();
	useEffect(() => {
		client.sync.presence.update({ viewingRecipeId: recipeId });
		return () => {
			client.sync.presence.update({ viewingRecipeId: null });
		};
	}, [recipeId, client]);

	return (
		<div className={clsx(classes.container, className)}>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<PageFixedArea className={sprinkles({ px: 0 })}>
				<CookingActionBar recipe={recipe} />
			</PageFixedArea>
			<InstructionsProvider isEditing={false}>
				<RecipeInstructionsViewer recipe={recipe} />
			</InstructionsProvider>
			<CookingToolbar recipe={recipe} />
		</div>
	);
}
