import { commit, Context, SID_of } from '@aphro/runtime-ts';
import GroceryCategory from './.generated/GroceryCategory';
import GroceryFoodCategoryLookup from './.generated/GroceryFoodCategoryLookup';
import GroceryFoodCategoryLookupMutations from './.generated/GroceryFoodCategoryLookupMutations';
import GroceryItem from './.generated/GroceryItem';
import GroceryItemMutations from './.generated/GroceryItemMutations';

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
