import { groceriesState } from '@/components/groceries/state.js';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { MultiplierStepper } from './MultiplierStepper.jsx';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';
import { Button, ButtonProps } from '@aglio/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { Checkbox } from '@aglio/ui/components/checkbox';
import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { AddToListDialog } from '@/components/recipes/viewer/AddToListDialog.jsx';

export interface AddToListButtonProps extends ButtonProps {
	recipe: Recipe;
	listId?: string | null;
}

export function AddToListButton({
	recipe,
	children,
	listId = null,
	...rest
}: AddToListButtonProps) {
	return (
		<OnboardingTooltip
			content={
				<div>Use this button to add ingredients to your grocery list.</div>
			}
			onboarding={saveHubRecipeOnboarding}
			step="addToList"
			disableNext
			// prevent interactions inside the dialog
			// from skipping the step
			ignoreOutsideInteraction={(el) => !!el.closest('role="dialog"')}
		>
			<div>
				<AddToListDialog recipe={recipe} listId={listId}>
					<DialogTrigger asChild>
						<Button color="default" {...rest}>
							{children || 'Add to list'}
						</Button>
					</DialogTrigger>
				</AddToListDialog>
			</div>
		</OnboardingTooltip>
	);
}
