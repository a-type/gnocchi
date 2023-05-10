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
import { PageFixedArea } from '@aglio/ui/src/components/layouts';
import { LinkButton } from '@/components/nav/Link.jsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Suspense, useState } from 'react';
import {
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from '@aglio/ui/src/components/tabs';
import { Link } from '@verdant-web/react-router';
import { IngredientCheckoffView } from '@/components/recipes/viewer/IngredientCheckoffView.jsx';
import { sprinkles } from '@aglio/ui/styles';

export interface RecipeCookViewProps {
	className?: string;
	tab?: 'prep' | 'cook';
}

export function RecipeCookView({
	className,
	tab = 'cook',
}: RecipeCookViewProps) {
	const recipe = useCookingRecipe();
	useWatchChanges(recipe);

	return (
		<div className={classNames(classes.container, className)}>
			<PageFixedArea className={classes.fixedArea}>
				<CookingActionBar recipe={recipe} />
				<LinkButton
					to={makeRecipeLink(recipe)}
					color="ghost"
					onClick={() => recipe.set('session', null)}
				>
					<span>Stop Cooking</span>
					<Cross2Icon />
				</LinkButton>
			</PageFixedArea>
			<H1 gutterBottom={false}>{recipe.get('title')}</H1>
			<RecipeNote recipe={recipe} />
			<TabsRoot value={tab} className={classes.tabsRoot}>
				<TabsList className={sprinkles({ width: 'full' })}>
					<Link to={makeRecipeLink(recipe, '/cook/prep')}>
						<TabsTrigger value="prep">Prep</TabsTrigger>
					</Link>
					<Link to={makeRecipeLink(recipe, '/cook/steps')}>
						<TabsTrigger value="cook">Cook</TabsTrigger>
					</Link>
				</TabsList>
				<TabsContent value="prep" className={classes.content}>
					<IngredientCheckoffView recipe={recipe} />
				</TabsContent>
				<TabsContent value="cook" className={classes.content}>
					<Suspense>
						<InstructionsProvider
							isEditing={false}
							showTools
							recipeId={recipe.get('id')}
						>
							<RecipeInstructionsViewer recipe={recipe} />
						</InstructionsProvider>
					</Suspense>
					<Suspense
						fallback={
							<div
								style={{
									width: '100%',
									height: '100%',
									backgroundColor: 'red',
								}}
							/>
						}
					>
						<AddImagePrompt recipe={recipe} />
						<AddNotePrompt recipe={recipe} />
						<CookingToolbar recipe={recipe} />
					</Suspense>
				</TabsContent>
			</TabsRoot>
		</div>
	);
}
