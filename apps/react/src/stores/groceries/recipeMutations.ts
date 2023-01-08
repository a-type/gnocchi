import { signupDialogState } from '@/components/sync/StartSignupDialog.jsx';
import { trpcClient } from '@/trpc.js';
import { parseIngredient } from '@aglio/conversion';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-hot-toast';
import {
	Recipe,
	RecipeIngredientsItemInit,
	RecipeIngredients,
} from '@aglio/groceries-client';
import { groceriesDescriptor } from './index.js';
import { generateJSON } from '@tiptap/html';
import { createTiptapExtensions } from '@/components/recipes/editor/tiptapExtensions.js';

export async function addIngredients(
	ingredients: RecipeIngredients,
	text: string,
) {
	const lines = text.split('\n');
	const parsed = lines
		.filter((line) => line.trim().length > 0)
		.map((line): RecipeIngredientsItemInit => {
			const parsedItem = parseIngredient(line);
			return {
				text: line,
				food: parsedItem.food,
				comments: parsedItem.comments,
				quantity: parsedItem.quantity,
				unit: parsedItem.unit,
			};
		});
	for (const item of parsed) {
		ingredients.push(item);
	}
}

async function getScannedRecipe(url: string) {
	try {
		const scanned = await trpcClient.scans.recipe.query({
			url,
		});
		let ingredients: RecipeIngredientsItemInit[] = [];
		if (scanned.rawIngredients?.length) {
			ingredients = scanned.rawIngredients.map((line: string) => {
				const parsed = parseIngredient(line);
				return {
					text: parsed.original,
					food: parsed.food,
					unit: parsed.unit,
					comments: parsed.comments,
					quantity: parsed.quantity,
				};
			});
		} else if (scanned.detailedIngredients?.length) {
			ingredients = scanned.detailedIngredients.map(
				(i: {
					original: string;
					quantity: number;
					foodName: string;
					unit?: string | null;
					comments?: string[];
					preparations?: string[];
				}) => ({
					food: i.foodName,
					quantity: i.quantity,
					unit: i.unit || '',
					comments: i.comments || [],
					text: i.original,
				}),
			);
		}
		return {
			url: scanned.url,
			title: scanned.title || 'Web Recipe',
			ingredients: ingredients.length ? ingredients : undefined,
			instructions: scanned.steps?.length
				? generateJSON(
						(scanned.steps || [])
							.map((line: string) => `<p>${line}</p>`)
							.join('\n'),
						createTiptapExtensions(),
				  )
				: undefined,
		};
	} catch (err) {
		if (err instanceof TRPCClientError && err.message === 'FORBIDDEN') {
			signupDialogState.status = 'open';
		}
		throw err;
	}
}

export async function addRecipeFromUrl(url: string) {
	const client = await groceriesDescriptor.open();

	try {
		const scanned = await getScannedRecipe(url);
		const recipe = await client.recipes.put(scanned);
		return recipe;
	} catch (err) {
		if (!(err instanceof TRPCClientError && err.message === 'FORBIDDEN')) {
			toast.error('Something went wrong.');
		}
	}
}

export async function updateRecipeFromUrl(recipe: Recipe, url: string) {
	try {
		const scanned = await getScannedRecipe(url);

		recipe.update({
			title: scanned.title,
			url: scanned.url,
			ingredients: scanned.ingredients,
		});

		// set this separately - do not merge
		if (scanned.instructions) {
			recipe.set('instructions', scanned.instructions);
		}

		return recipe;
	} catch (err) {
		if (!(err instanceof TRPCClientError && err.message === 'FORBIDDEN')) {
			toast.error('Something went wrong.');
		}
	}
}
