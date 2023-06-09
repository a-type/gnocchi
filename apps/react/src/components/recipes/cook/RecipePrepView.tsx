import { P } from '@aglio/ui/components/typography';
import { IngredientCheckoffView } from './IngredientCheckoffView.js';
import { useCookingRecipe } from './RecipeCookContext.js';

export interface RecipePrepViewProps {}

export function RecipePrepView({}: RecipePrepViewProps) {
	const recipe = useCookingRecipe();

	return (
		<div className="flex flex-col gap-3 w-full max-w-600px flex-col items-center">
			<P className="text-xs mb-2">
				Prepping ingredients by collecting them and pre-measuring quantities can
				help cooking go faster.
			</P>
			<IngredientCheckoffView recipe={recipe} />
		</div>
	);
}
