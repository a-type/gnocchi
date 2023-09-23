import { Checkbox } from '@aglio/ui/components/checkbox';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe, RecipeIngredientsItem } from '@aglio/groceries-client';
import { forwardRef } from 'react';
import classNames from 'classnames';
import { RecipeIngredientViewer } from '../viewer/RecipeIngredientViewer.jsx';
import {
	useActiveCookingSession,
	useCookSessionAction,
} from '@/components/recipes/hooks.js';

export interface IngredientCheckoffViewProps {
	recipe: Recipe;
	className?: string;
}

export const IngredientCheckoffView = forwardRef<
	HTMLUListElement,
	IngredientCheckoffViewProps
>(function IngredientCheckoffView({ recipe, className }, ref) {
	const session = useActiveCookingSession(recipe);
	hooks.useWatch(session);
	const sessionAction = useCookSessionAction(recipe);
	const completedIngredients = session?.get('completedIngredients') ?? null;
	hooks.useWatch(completedIngredients);
	const { ingredients, multiplier } = hooks.useWatch(recipe);
	hooks.useWatch(ingredients);

	return (
		<ul
			ref={ref}
			className={classNames(
				'list-none m-0 flex flex-col gap-4 p-0 w-full',
				className,
			)}
		>
			{ingredients.map((ingredient) => (
				<IngredientCheckoffItem
					key={ingredient.get('id')}
					ingredient={ingredient}
					multiplier={multiplier}
					checked={completedIngredients?.has(ingredient.get('id')) ?? false}
					recipeId={recipe.get('id')}
					onCheckedChange={(checked) => {
						sessionAction((session) => {
							if (checked) {
								session.get('completedIngredients').add(ingredient.get('id'));
							} else {
								session
									.get('completedIngredients')
									.removeAll(ingredient.get('id'));
							}
						});
					}}
				/>
			))}
		</ul>
	);
});

function IngredientCheckoffItem({
	ingredient,
	onCheckedChange,
	checked,
	multiplier,
	recipeId,
}: {
	ingredient: RecipeIngredientsItem;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	multiplier?: number;
	recipeId: string;
}) {
	const isSectionHeader = hooks.useWatch(ingredient, 'isSectionHeader');
	return (
		<li className={'flex flex-row gap-2 w-full'}>
			{!isSectionHeader && (
				<Checkbox
					checked={checked}
					onCheckedChange={(checked) => onCheckedChange(checked === true)}
				/>
			)}
			<RecipeIngredientViewer
				className="flex-1"
				ingredient={ingredient}
				multiplier={multiplier}
				recipeId={recipeId}
			/>
		</li>
	);
}
