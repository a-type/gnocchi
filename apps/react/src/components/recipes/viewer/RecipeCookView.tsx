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
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { PageFixedArea } from '@aglio/ui/src/components/layouts';
import { LinkButton } from '@/components/nav/Link.jsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Suspense } from 'react';
import {
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from '@aglio/ui/src/components/tabs';
import { Link } from '@verdant-web/react-router';
import { IngredientCheckoffView } from '@/components/recipes/viewer/IngredientCheckoffView.jsx';

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
		<div
			className={classNames(
				'gap-4 flex flex-col items-start mb-300px',
				className,
			)}
		>
			<PageFixedArea className="flex flex-row items-center justify-between gap-2 w-full">
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
			<TabsRoot value={tab} className="w-full">
				<TabsList className="w-full">
					<Link to={makeRecipeLink(recipe, '/cook/prep')}>
						<TabsTrigger value="prep">Prep</TabsTrigger>
					</Link>
					<Link to={makeRecipeLink(recipe, '/cook/steps')}>
						<TabsTrigger value="cook">Cook</TabsTrigger>
					</Link>
				</TabsList>
				<TabsContent value="prep" className="animate-fade-in-up">
					<IngredientCheckoffView recipe={recipe} />
				</TabsContent>
				<TabsContent value="cook" className="animate-fade-in-up">
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
				</TabsContent>
			</TabsRoot>
		</div>
	);
}
