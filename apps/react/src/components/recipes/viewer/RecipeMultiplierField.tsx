import { hooks, Recipe } from '@/stores/recipes/index.js';
import { MultiplierStepper } from './MultiplierStepper.jsx';

export interface RecipeMultiplierFieldProps {
	recipe: Recipe;
}

export function RecipeMultiplierField({ recipe }: RecipeMultiplierFieldProps) {
	const { multiplier } = hooks.useWatch(recipe);
	return (
		<MultiplierStepper
			value={multiplier}
			onChange={(val) => recipe.set('multiplier', val)}
		/>
	);
}
