import { commit, Context, P, SID_of, UpdateType } from '@aphro/runtime-ts';
import { generateKeyBetween } from 'fractional-indexing';
import {
	GroceryCategoryMutations,
	GroceryFoodCategoryLookupMutations,
	GroceryInputMutations,
	GroceryItemMutations,
} from './domain/generated/exports.js';
import GroceryCategory from './domain/GroceryCategory.js';
import GroceryFoodCategoryLookup from './domain/GroceryFoodCategoryLookup.js';
import GroceryItem from './domain/GroceryItem.js';
import GroceryList from './domain/GroceryList.js';

import { parseIngredient } from '@aglio/conversion';
import { assert } from '@aglio/tools';
import { EMPTY_CATEGORY_NAME } from './constants.js';
import { start } from './start.js';

export class Groceries {
	private _startedPromise: Promise<{ ctx: Context; list: GroceryList }>;

	constructor() {
		this._startedPromise = start();
	}

	get contextPromise() {
		return this._startedPromise.then(({ ctx }) => ctx);
	}

	/** Live Queries */
	listCategories = async () => {
		const { ctx } = await this._startedPromise;
		return GroceryCategory.queryAll(ctx).live(UpdateType.ANY);
	};

	listItemsForCategory = async (categoryId: SID_of<GroceryCategory>) => {
		const { ctx } = await this._startedPromise;
		return GroceryItem.queryAll(ctx)
			.whereCategoryId(P.equals(categoryId))
			.live(UpdateType.ANY);
	};

	/** Mutations */
	setItemCategory = async (
		item: GroceryItem,
		categoryId: SID_of<GroceryCategory>,
	) => {
		const { ctx } = await this._startedPromise;

		// lookup existing
		const existing = await GroceryFoodCategoryLookup.gen(ctx, item.name as any);

		return commit(ctx, [
			...item.mutations
				.setCategory({
					categoryId,
				})
				.toChangesets(),
			...(!existing
				? GroceryFoodCategoryLookupMutations.create(ctx, {
						id: item.name as any,
						categoryId,
				  }).toChangesets()
				: existing.mutations
						.setCategory({
							categoryId,
						})
						.toChangesets()),
		]);
	};

	addItems = async (lines: string[]) => {
		if (!lines.length) return;

		const { ctx, list } = await this._startedPromise;
		const listId = list.id;

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
					...match.mutations
						.setTotalQuantity({
							totalQuantity: match.totalQuantity + parsed.quantity,
						})
						.toChangesets(),
					...GroceryInputMutations.create(ctx, {
						itemId: match.id,
						text: line,
					}).toChangesets(),
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
	};

	toggleItemPurchased = async (item: GroceryItem) => {
		const { ctx } = await this._startedPromise;

		const newPurchasedQuantity =
			item.purchasedQuantity < item.totalQuantity ? item.totalQuantity : 0;

		return commit(ctx, [
			...item.mutations
				.setPurchasedQuantity({
					purchasedQuantity: newPurchasedQuantity,
				})
				.toChangesets(),
		]);
	};

	createCategory = async (name: string) => {
		const { ctx } = await this._startedPromise;
		return GroceryCategoryMutations.create(ctx, {
			name,
		}).save();
	};
}
