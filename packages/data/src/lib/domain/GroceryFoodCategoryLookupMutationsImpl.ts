import { CreateArgs } from './generated/GroceryFoodCategoryLookupMutations.js';
import { SetCategoryArgs } from './generated/GroceryFoodCategoryLookupMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './GroceryFoodCategoryLookup.js';
import GroceryFoodCategoryLookup from './GroceryFoodCategoryLookup.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export function createImpl(
	mutator: Omit<
		IMutationBuilder<GroceryFoodCategoryLookup, Data>,
		'toChangeset'
	>,
	{ id, categoryId }: CreateArgs,
): void | Changeset<any>[] {
	mutator.set({ id, categoryId });
}

export function setCategoryImpl(
	model: GroceryFoodCategoryLookup,
	mutator: Omit<
		IMutationBuilder<GroceryFoodCategoryLookup, Data>,
		'toChangeset'
	>,
	{ categoryId }: SetCategoryArgs,
): void | Changeset<any>[] {
	mutator.set({ categoryId });
}
