import { PageFixedArea } from '@aglio/ui';
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
import { RecipeMainImageEditor } from './RecipeMainImageEditor.jsx';
import {
	ImageContainer,
	TitleAndImageLayout,
	TitleContainer,
} from '../layout/TitleAndImageLayout.jsx';
import { RecipePreludeEditor } from './RecipePreludeEditor.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { useEffect } from 'react';

export interface RecipeEditorProps {
	slug: string;
}

export function RecipeEditor({ slug }: RecipeEditorProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	if (!recipe) return <RecipeNotFound />;

	return <RecipeEditorContent recipe={recipe} />;
}

const fixedAreaStyle = { zIndex: 10 };

function RecipeEditorContent({ recipe }: { recipe: Recipe }) {
	useWatchChanges(recipe);

	return (
		<Box direction="column" gap={8}>
			<PageFixedArea
				className={sprinkles({ px: 0, py: 1 })}
				style={fixedAreaStyle}
			>
				<RecipeEditActions />
			</PageFixedArea>
			<Box direction="column" gap={2}>
				<TitleAndImageLayout>
					<TitleContainer>
						<RecipeTitleField recipe={recipe} />
					</TitleContainer>
					<ImageContainer>
						<RecipeMainImageEditor recipe={recipe} />
					</ImageContainer>
				</TitleAndImageLayout>
				<RecipeUrlField recipe={recipe} />
			</Box>
			<RecipeTagsEditor recipe={recipe} />
			<div>
				<H2 gutterBottom>Description</H2>
				<RecipePreludeEditor recipe={recipe} />
			</div>
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
			<div>
				<H2>Danger zone</H2>
				<RecipeDeleteButton
					className={sprinkles({ alignSelf: 'flex-start' })}
					recipe={recipe}
				/>
			</div>
		</Box>
	);
}

/**
 * Updates the updatedAt timestamp for any changes to
 * instructions, ingredients, or prelude.
 */
function useWatchChanges(recipe: Recipe) {
	const { ingredients, instructions, prelude } = hooks.useWatch(recipe);

	useEffect(() => {
		const unsubs = new Array<() => void>();
		const updateTime = () => {
			recipe.set('updatedAt', Date.now());
		};
		unsubs.push(ingredients.subscribe('changeDeep', updateTime));
		unsubs.push(instructions.subscribe('changeDeep', updateTime));
		unsubs.push(prelude.subscribe('changeDeep', updateTime));
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [ingredients, instructions, prelude]);
}
