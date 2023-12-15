import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { withClassName } from '@a-type/ui/hooks';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { useCallback } from 'react';

export interface RecipeTimeFieldsProps {
	recipe: Recipe;
}

export function RecipeTimeFields({ recipe }: RecipeTimeFieldsProps) {
	const { prepTimeMinutes, cookTimeMinutes, totalTimeMinutes } =
		hooks.useWatch(recipe);
	const updateComponentTime = useCallback(
		(key: 'prepTimeMinutes' | 'cookTimeMinutes', valueStr: string) => {
			const prevTotal = recipe.get('totalTimeMinutes') ?? 0;
			const prevComponentSum =
				(recipe.get('prepTimeMinutes') ?? 0) +
				(recipe.get('cookTimeMinutes') ?? 0);
			const totalIsSum = prevTotal === prevComponentSum;

			if (valueStr === '') {
				recipe.set(key, null);
			} else {
				const value = parseInt(valueStr);
				if (isNaN(value)) return;

				recipe.set(key, value);
			}
			if (totalIsSum) {
				recipe.set(
					'totalTimeMinutes',
					(recipe.get('prepTimeMinutes') ?? 0) +
						(recipe.get('cookTimeMinutes') ?? 0),
				);
			}
		},
		[recipe],
	);

	return (
		<div className="flex flex-col gap-1 items-stretch">
			<Row>
				<label htmlFor="recipePrepTime" className="flex-1">
					Prep Time (minutes)
				</label>
				<LiveUpdateTextField
					id="recipePrepTime"
					type="number"
					value={prepTimeMinutes?.toString() ?? '0'}
					onChange={(val) => {
						updateComponentTime('prepTimeMinutes', val);
					}}
					className="w-24"
				/>
			</Row>
			<Row>
				<label htmlFor="recipeCookTime" className="flex-1">
					Cook Time (minutes)
				</label>
				<LiveUpdateTextField
					id="recipeCookTime"
					type="number"
					value={cookTimeMinutes?.toString() ?? '0'}
					onChange={(val) => {
						updateComponentTime('cookTimeMinutes', val);
					}}
					className="w-24"
				/>
			</Row>
			<Row>
				<label htmlFor="recipeTotalTime" className="flex-1">
					Total Time (minutes)
				</label>
				<LiveUpdateTextField
					id="recipeTotalTime"
					type="number"
					value={totalTimeMinutes?.toString() ?? '0'}
					onChange={(val) => {
						if (val === '') {
							recipe.set('totalTimeMinutes', null);
							return;
						} else {
							const v = parseInt(val);
							if (isNaN(v)) return;
							recipe.set('totalTimeMinutes', v);
						}
					}}
					className="w-24"
				/>
			</Row>
		</div>
	);
}

const Row = withClassName('div', 'flex flex-row items-center');
