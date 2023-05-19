import { Recipe } from '@aglio/groceries-client';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import { useRecipeFromSlugUrl, useWatchChanges } from '../hooks.js';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { InstructionsProvider } from './InstructionStepNodeView.jsx';
import { RecipeDeleteButton } from './RecipeDeleteButton.jsx';
import { RecipeEditActions } from './RecipeEditActions.jsx';
import { RecipeIngredientsEditor } from './RecipeIngredientsEditor.jsx';
import { RecipeInstructionsField } from './RecipeInstructionsField.jsx';
import { RecipeMainImageEditor } from './RecipeMainImageEditor.jsx';
import { RecipePreludeEditor } from './RecipePreludeEditor.jsx';
import { RecipeTagsEditor } from './RecipeTagsEditor.jsx';
import { RecipeTitleField } from './RecipeTitleField.jsx';
import { RecipeUrlField } from './RecipeUrlField.jsx';
import { H2 } from '@aglio/ui/components/typography';
import { HeaderBar } from '@/components/recipes/layout/HeaderBar.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	if (!recipe) return <RecipeNotFound />;

	return <RecipeEditorContent recipe={recipe} />;
}

function RecipeEditorContent({ recipe }: { recipe: Recipe }) {
	useWatchChanges(recipe);

	return (
		<div className="flex flex-col gap-8">
			<HeaderBar backUrl={makeRecipeLink(recipe, '')}>
				<RecipeEditActions />
			</HeaderBar>
			<div className="flex flex-col gap-2">
				<TitleAndImageLayout>
					<TitleContainer>
						<RecipeTitleField recipe={recipe} />
					</TitleContainer>
					<ImageContainer>
						<RecipeMainImageEditor recipe={recipe} />
					</ImageContainer>
				</TitleAndImageLayout>
				<RecipeUrlField recipe={recipe} />
			</div>
			<RecipeTagsEditor recipe={recipe} />
			<div>
				<H2 className="gutter-bottom">Description</H2>
				<RecipePreludeEditor recipe={recipe} />
			</div>
			<div>
				<H2 className="gutter-bottom">Ingredients</H2>
				<RecipeIngredientsEditor recipe={recipe} />
			</div>
			<div>
				<InstructionsProvider isEditing showTools recipeId={recipe.get('id')}>
					<H2 className="gutter-bottom">Instructions</H2>
					<RecipeInstructionsField recipe={recipe} />
				</InstructionsProvider>
			</div>
			<div>
				<H2 className="gutter-bottom">Danger zone</H2>
				<RecipeDeleteButton className="self-start" recipe={recipe} />
			</div>
		</div>
	);
}
