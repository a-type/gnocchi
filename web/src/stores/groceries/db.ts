import Dexie, { Table } from 'dexie';
import { assert } from 'lib/assert';
import { parseIngredient } from 'lib/conversion/parseIngredient';

export const DEFAULT_CATEGORY = 'None';

type ID = number;

export interface GroceryCategory {
	id: ID;
	name: string;

	// -> items: GroceryItem[];
	// -> lookups: GroceryItemLookup[];
}

export interface GroceryFoodCategoryLookup {
	id: ID;
	foodName: string;
	categoryId: ID;

	// -> category: GroceryCategory;
}

export interface GroceryInput {
	id: ID;
	itemId: ID;
	text: string;

	// -> item: GroceryItem;
}

export interface GroceryItem {
	id: ID;
	categoryId: ID;

	createdAt: number;
	totalQuantity: number;
	purchasedQuantity: number;
	unit: string;
	food: string;
	sortKey: string;

	// -> inputs: GroceryInput[];
	// -> category: GroceryCategory;
}

export class GroceryListDb extends Dexie {
	categories!: Table<GroceryCategory, ID>;
	foodCategoryLookups!: Table<GroceryFoodCategoryLookup, ID>;
	items!: Table<GroceryItem, ID>;
	inputs!: Table<GroceryInput, ID>;

	constructor() {
		super('groceries-dexie');
		this.version(1).stores({
			categories: '++id,name',
			foodCategoryLookups: '++id,foodName',
			items: '++id,categoryId,food',
			inputs: '++id,itemId',
		});
	}

	setItemCategory = async (itemId: ID, categoryId: ID) => {
		return this.transaction(
			'rw',
			this.items,
			this.foodCategoryLookups,
			async (tx) => {
				const item = await this.items.get(itemId);
				if (!item) return;

				const foodCategoryLookup = await this.foodCategoryLookups
					.where('foodName')
					.equals(item.food)
					.first();
				if (foodCategoryLookup) {
					foodCategoryLookup.categoryId = categoryId;
					this.foodCategoryLookups.put(foodCategoryLookup);
				} else {
					this.foodCategoryLookups.add({
						foodName: item.food,
						categoryId,
						id: undefined as any,
					});
				}
				item.categoryId = categoryId;
				this.items.put(item);
			},
		);
	};

	addItems = async (lines: string[]) => {
		if (!lines.length) return;
		const defaultCategory = await this.categories
			.where('name')
			.equals(DEFAULT_CATEGORY)
			.first();
		let defaultCategoryId = defaultCategory?.id;
		if (!defaultCategoryId) {
			defaultCategoryId = await this.categories.add({
				name: DEFAULT_CATEGORY,
				id: undefined as any,
			});
		}
		assert(defaultCategoryId);

		await this.transaction(
			'rw',
			this.items,
			this.inputs,
			this.foodCategoryLookups,
			async (tx) => {
				for (const line of lines) {
					let itemId: ID;
					// NOTE: if this ever goes async, it can't live inside transaction.
					// https://dexie.org/docs/Dexie/Dexie.transaction()#the-auto-commit-behavior-of-indexeddb-transactions
					const parsed = parseIngredient(line);
					const firstMatch = await this.items
						.where('food')
						.equals(parsed.food)
						.and((item) => item.unit === parsed.unit)
						.first();
					if (firstMatch) {
						firstMatch.totalQuantity += parsed.quantity;
						firstMatch.purchasedQuantity += parsed.quantity;
						await this.items.put(firstMatch);
						itemId = firstMatch.id;
					} else {
						// lookup category if available
						const lookup = await this.foodCategoryLookups
							.where('foodName')
							.equals(parsed.food)
							.first();
						const categoryId = lookup?.categoryId ?? defaultCategoryId;
						assert(categoryId);

						itemId = await this.items.add({
							categoryId,
							createdAt: Date.now(),
							totalQuantity: parsed.quantity,
							purchasedQuantity: 0,
							unit: parsed.unit,
							food: parsed.food,
							sortKey: parsed.food,
							id: undefined as any,
						});
					}

					assert(itemId);

					await this.inputs.add({
						itemId,
						text: line,
						id: undefined as any,
					});
				}
			},
		);
	};

	createCategory = async (name: string) => {
		const id = await this.categories.add({
			name,
			id: undefined as any,
		});
		return {
			id,
			name,
		};
	};
}

export const groceries = new GroceryListDb();
