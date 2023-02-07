import { PageFixedArea } from '@/components/layouts/index.jsx';
import { H2, Box, LiveUpdateTextField } from '@aglio/ui';
import { sprinkles } from '@aglio/ui';
import { Recipe } from '@aglio/groceries-client';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeNotFound } from '../RecipeNotFound.jsx';
import {
	InstructionsContext,
	InstructionsProvider,
} from './InstructionStepNodeView.jsx';
import { RecipeDeleteButton } from './RecipeDeleteButton.jsx';
import { RecipeEditActions } from './RecipeEditActions.jsx';
import { RecipeIngredientsEditor } from './RecipeIngredientsEditor.jsx';
import { RecipeInstructionsField } from './RecipeInstructionsField.jsx';
import { RecipeTagsEditor } from './RecipeTagsEditor.jsx';
import { RecipeTitleField } from './RecipeTitleField.jsx';
import { RecipeUrlField } from './RecipeUrlField.jsx';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	if (!recipe) return <RecipeNotFound />;

	return <RecipeEditorContent recipe={recipe} />;
}

function RecipeEditorContent({ recipe }: { recipe: Recipe }) {
	return (
		<Box direction="column" gap={8}>
			<Box direction="column" gap={2}>
				<RecipeTitleField recipe={recipe} />
				<PageFixedArea className={sprinkles({ px: 0, py: 1 })}>
					<RecipeEditActions />
				</PageFixedArea>
				<RecipeUrlField recipe={recipe} />
			</Box>
			<RecipeTagsEditor recipe={recipe} />
			<div>
				<H2 gutterBottom>Ingredients</H2>
				<RecipeIngredientsEditor recipe={recipe} />
			</div>
			<div>
				<InstructionsProvider isEditing recipeId={recipe.get('id')}>
					<H2 gutterBottom>Instructions</H2>
					<RecipeInstructionsField recipe={recipe} />
				</InstructionsProvider>
			</div>
			<RecipeDeleteButton
				className={sprinkles({ alignSelf: 'start' })}
				recipe={recipe}
			/>
		</Box>
	);
}
