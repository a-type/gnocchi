import { AppearWithScroll } from '@/components/recipes/cook/AppearWithScroll.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { Recipe } from '@aglio/groceries-client';
import { P } from '@aglio/ui/src/components/typography';

export interface AddNotePromptProps {
	recipe: Recipe;
}

export function AddNotePrompt({ recipe }: AddNotePromptProps) {
	return (
		<AppearWithScroll>
			<P>Any notes for next time?</P>
			<RecipeNote recipe={recipe} />
		</AppearWithScroll>
	);
}
