import { context, anonymous, sql, Context } from '@aphro/runtime-ts';
import { createResolver } from '@aphro/absurd-sql-connector';
import GroceryList from './domain/GroceryList';
import GroceryCategory from './domain/GroceryCategory';
import GroceryListMutations from './domain/generated/GroceryListMutations';
import GroceryCategoryMutations from './domain/generated/GroceryCategoryMutations';
import { EMPTY_CATEGORY_NAME } from './constants';
import GroceryItem from './domain/GroceryItem';
import GroceryInput from './domain/GroceryInput';
import GroceryItemMutations from './domain/generated/GroceryItemMutations';
import GroceryInputMutations from './domain/generated/GroceryInputMutations';
import GroceryFoodCategoryLookup from './domain/GroceryFoodCategoryLookup';
import GroceryFoodCategoryLookupMutations from './domain/generated/GroceryFoodCategoryLookupMutations';

// @ts-ignore
import GroceryListTable from './domain/generated/GroceryList.sqlite.sql';
// @ts-ignore
import GroceryItemTable from './domain/generated/GroceryItem.sqlite.sql';
// @ts-ignore
import GroceryInputTable from './domain/generated/GroceryInput.sqlite.sql';
// @ts-ignore
import GroceryCategoryTable from './domain/generated/GroceryCategory.sqlite.sql';
// @ts-ignore
import GroceryFoodCategoryLookupTable from './domain/generated/GroceryFoodCategoryLookup.sqlite.sql';

export type GroceryInputData = {
	text: string;
};

export type GroceryItemData = {
	id: string;
	createdAt: number;
	totalQuantity: number;
	purchasedQuantity: number;
	unit?: string;
	name: string;

	category: string;

	mergedEntries: GroceryInputData[];
};
export type GroceryListData = Array<GroceryItemData>;

async function bootstrap(ctx: Context) {
	const db = ctx.dbResolver.engine('sqlite').db('groceries');

	// creating the tables
	await Promise.all([
		db.query(sql.__dangerous__rawValue(GroceryListTable)),
		db.query(sql.__dangerous__rawValue(GroceryItemTable)),
		db.query(sql.__dangerous__rawValue(GroceryInputTable)),
		db.query(sql.__dangerous__rawValue(GroceryCategoryTable)),
		db.query(sql.__dangerous__rawValue(GroceryFoodCategoryLookupTable)),
	]);

	let list = await GroceryList.queryAll(ctx).genOnlyValue();
	if (!list) {
		list = await GroceryListMutations.create(ctx, {
			name: 'Default list',
		}).save();
	}

	const categories = await GroceryCategory.queryAll(ctx).gen();
	if (!categories.length) {
		// TODO: default categories
		await GroceryCategoryMutations.create(ctx, {
			name: EMPTY_CATEGORY_NAME,
		}).save();
	}

	// log some debug stuff
	console.log(
		'Categories',
		categories.map((c) => c.name),
	);

	return { list, ctx };
}

export async function start() {
	const resolver = await createResolver();
	const ctx = context(anonymous(), resolver);
	const data = await bootstrap(ctx);

	// expose some tools
	(window as any).ctx = ctx;
	(window as any).GroceryCategory = GroceryCategory;
	(window as any).GroceryList = GroceryList;
	(window as any).GroceryListMutations = GroceryListMutations;
	(window as any).GroceryItem = GroceryItem;
	(window as any).GroceryItemMutations = GroceryItemMutations;
	(window as any).GroceryInput = GroceryInput;
	(window as any).GroceryInputMutations = GroceryInputMutations;
	(window as any).GroceryCategoryMutations = GroceryCategoryMutations;
	(window as any).GroceryFoodCategoryLookup = GroceryFoodCategoryLookup;
	(window as any).GroceryFoodCategoryLookupMutations =
		GroceryFoodCategoryLookupMutations;

	return data;
}
