import { commit, Context, P, SID_of } from '@aphro/runtime-ts';
import { generateKeyBetween } from 'fractional-indexing';
import { assert } from '@aglio/tools';
import { parseIngredient } from '@aglio/conversion';
import GroceryCategory from './domain/GroceryCategory';
import GroceryCategoryMutations from './domain/generated/GroceryCategoryMutations';
import GroceryFoodCategoryLookup from './domain/GroceryFoodCategoryLookup';
import GroceryFoodCategoryLookupMutations from './domain/generated/GroceryFoodCategoryLookupMutations';
import GroceryInputMutations from './domain/generated/GroceryInputMutations';
import GroceryItem from './domain/GroceryItem';
import GroceryItemMutations from './domain/generated/GroceryItemMutations';
import GroceryList from './domain/GroceryList';
import { EMPTY_CATEGORY_NAME } from './constants';

export async function setItemCategory(
	ctx: Context,
	item: GroceryItem,
	categoryId: SID_of<GroceryCategory>,
) {
	// lookup existing
	const existing = await GroceryFoodCategoryLookup.gen(ctx, item.name as any);

	return commit(ctx, [
		GroceryItemMutations.setCategory(item, {
			categoryId,
		}).toChangeset(),
		!existing
			? GroceryFoodCategoryLookupMutations.create(ctx, {
					id: item.name as any,
					categoryId,
			  }).toChangeset()
			: GroceryFoodCategoryLookupMutations.setCategory(existing, {
					categoryId,
			  }).toChangeset(),
	]);
}

/**
 * Supports adding multiple items, like
   butter
	 salmon
	 4 tbsp capers
 */
export async function addItems(
	ctx: Context,
	listId: SID_of<GroceryList>,
	lines: string[],
) {
	if (!lines.length) return;

	let defaultCategory = await GroceryCategory.queryAll(ctx)
		.whereName(P.equals(EMPTY_CATEGORY_NAME))
		.genOnlyValue();
	if (!defaultCategory) {
		defaultCategory = await GroceryCategoryMutations.create(ctx, {
			name: EMPTY_CATEGORY_NAME,
		}).save();
	}
	assert(!!defaultCategory);

	for (const line of lines) {
		const parsed = parseIngredient(line);
		// find an item that matches the name
		const matches = await GroceryItem.queryAll(ctx)
			.whereName(P.equals(parsed.food))
			.whereUnit(P.equals(parsed.unit || ''))
			.gen();
		const match = matches[0];
		if (match) {
			// add the quantity to the existing item
			commit(ctx, [
				GroceryItemMutations.setTotalQuantity(match, {
					totalQuantity: match.totalQuantity + parsed.quantity,
				}).toChangeset(),
				GroceryInputMutations.create(ctx, {
					itemId: match.id,
					text: line,
				}).toChangeset(),
			]);
		} else {
			// lookup the category
			const matchingCategoryLookup = await GroceryFoodCategoryLookup.gen(
				ctx,
				parsed.food as any,
			);
			let matchingCategoryId = matchingCategoryLookup?.categoryId;
			if (!matchingCategoryId) {
				matchingCategoryId = defaultCategory?.id;
			}

			const lastCategoryItem = await GroceryItem.queryAll(ctx)
				.whereCategoryId(P.equals(matchingCategoryId!))
				.orderBySortKey('desc')
				.take(1)
				.genOnlyValue();

			// create a new item
			const item = await GroceryItemMutations.create(ctx, {
				name: parsed.food,
				totalQuantity: parsed.quantity,
				unit: parsed.unit || '',
				categoryId: matchingCategoryId!,
				listId,
				purchasedQuantity: 0,
				createdAt: Date.now(),
				sortKey: generateKeyBetween(lastCategoryItem?.sortKey ?? null, null),
			}).save();
			GroceryInputMutations.create(ctx, {
				itemId: item.id,
				text: line,
			}).save();
		}
	}
}
