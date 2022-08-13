import { context, anonymous, sql, Context, bootstrap } from '@aphro/runtime-ts';
import { createResolver } from '@aphro/absurd-sql-connector';
import GroceryList from './domain/GroceryList.js';
import GroceryCategory from './domain/GroceryCategory.js';
import GroceryListMutations from './domain/generated/GroceryListMutations.js';
import GroceryCategoryMutations from './domain/generated/GroceryCategoryMutations.js';
import { EMPTY_CATEGORY_NAME } from './constants.js';
import GroceryItem from './domain/GroceryItem.js';
import GroceryInput from './domain/GroceryInput.js';
import GroceryItemMutations from './domain/generated/GroceryItemMutations.js';
import GroceryInputMutations from './domain/generated/GroceryInputMutations.js';
import GroceryFoodCategoryLookup from './domain/GroceryFoodCategoryLookup.js';
import GroceryFoodCategoryLookupMutations from './domain/generated/GroceryFoodCategoryLookupMutations.js';

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

async function setup(ctx: Context) {
	const db = ctx.dbResolver.engine('sqlite').db('groceries');

	// creating the tables
	await bootstrap.createAutomigrateIfExists(ctx.dbResolver, {
		sqlite: {
			aglio: {
				GroceryList: GroceryListTable,
				GroceryItem: GroceryItemTable,
				GroceryInput: GroceryInputTable,
				GroceryCategory: GroceryCategoryTable,
				GroceryFoodCategoryLookup: GroceryFoodCategoryLookupTable,
			},
		},
	});

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
	const data = await setup(ctx);

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
