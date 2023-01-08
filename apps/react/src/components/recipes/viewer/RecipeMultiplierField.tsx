import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
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
