import { AppearWithScroll } from '@/components/recipes/cook/AppearWithScroll.jsx';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { Recipe } from '@aglio/groceries-client';
import { P } from '@a-type/ui/components/typography';

export interface AddNotePromptProps {
	recipe: Recipe;
}

export function AddNotePrompt({ recipe }: AddNotePromptProps) {
	return (
		<AppearWithScroll className="flex flex-col gap-2">
			<P>Any notes for next time?</P>
			<RecipeNote recipe={recipe} />
		</AppearWithScroll>
	);
}
