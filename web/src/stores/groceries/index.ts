import { context, anonymous, sql, Context } from '@aphro/runtime-ts';
import { createResolver } from '@aphro/absurd-sql-connector';
import GroceryList from './.generated/GroceryList';
import GroceryCategory from './.generated/GroceryCategory';
import GroceryListMutations from './.generated/GroceryListMutations';
import GroceryListTable from './.generated/GroceryList.sqlite.sql';
import GroceryItemTable from './.generated/GroceryItem.sqlite.sql';
import GroceryInputTable from './.generated/GroceryInput.sqlite.sql';
import GroceryCategoryTable from './.generated/GroceryCategory.sqlite.sql';
import GroceryCategoryMutations from './.generated/GroceryCategoryMutations';

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
	]);

	let list = await GroceryList.queryAll(ctx).genOnlyValue();
	if (!list) {
		let _;
		[_, list] = GroceryListMutations.create(ctx, {
			name: 'Default list',
		}).save();
	}

	const categories = await GroceryCategory.queryAll(ctx).gen();
	if (!categories.length) {
		// TODO: default categories
		GroceryCategoryMutations.create(ctx, {
			name: 'None',
		}).save();
	}

	return { list, ctx };
}

export async function start() {
	const resolver = await createResolver();
	const ctx = context(anonymous(), resolver);
	const data = await bootstrap(ctx);
	return data;
}
