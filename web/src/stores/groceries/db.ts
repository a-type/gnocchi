import Dexie, { Table } from 'dexie';
import { assert } from 'lib/assert';
import { parseIngredient } from 'lib/conversion/parseIngredient';
import {
	toTypedRxJsonSchema,
	ExtractDocumentTypeFromTypedRxJsonSchema,
	createRxDatabase,
	RxDatabase,
	RxCollection,
	RxJsonSchema,
	RxDocument,
	RxQuery,
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import cuid from 'cuid';
import { suspend } from 'suspend-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generateKeyBetween } from 'fractional-indexing';

export const DEFAULT_CATEGORY = 'None';

type ID = string;

const categorySchemaLiteral = {
	title: 'Category schema',
	description: 'Schema for grocery categories',
	version: 0,
	keyCompression: true,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
	},
	required: ['id', 'name'],
	indexes: ['name'],
} as const;
const categorySchemaTyped = toTypedRxJsonSchema(categorySchemaLiteral);
export type GroceryCategory = ExtractDocumentTypeFromTypedRxJsonSchema<
	typeof categorySchemaTyped
>;
const categorySchema = categorySchemaLiteral as RxJsonSchema<GroceryCategory>;

const foodCategoryLookupSchemaLiteral = {
	title: 'Food category lookup schema',
	description: 'Schema for food category lookups',
	version: 0,
	keyCompression: true,
	primaryKey: 'foodName',
	type: 'object',
	properties: {
		foodName: {
			type: 'string',
		},
		categoryId: {
			type: 'string',
		},
	},
	required: ['foodName', 'categoryId'],
	indexes: ['categoryId'],
} as const;
const foodCategoryLookupSchemaTyped = toTypedRxJsonSchema(
	foodCategoryLookupSchemaLiteral,
);
export type FoodCategoryLookup = ExtractDocumentTypeFromTypedRxJsonSchema<
	typeof foodCategoryLookupSchemaTyped
>;
const foodCategoryLookupSchema =
	foodCategoryLookupSchemaLiteral as RxJsonSchema<FoodCategoryLookup>;

const inputSchemaLiteral = {
	title: 'Input schema',
	description: 'Schema for grocery inputs',
	version: 0,
	keyCompression: true,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		itemId: {
			type: 'string',
		},
		text: {
			type: 'string',
		},
	},
	required: ['id', 'itemId', 'text'],
	indexes: ['itemId'],
} as const;
const inputSchemaTyped = toTypedRxJsonSchema(inputSchemaLiteral);
export type GroceryInput = ExtractDocumentTypeFromTypedRxJsonSchema<
	typeof inputSchemaTyped
>;
const inputSchema = inputSchemaLiteral as RxJsonSchema<GroceryInput>;

const itemSchemaLiteral = {
	title: 'Item schema',
	description: 'Schema for grocery items',
	version: 0,
	keyCompression: true,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
		categoryId: {
			type: 'string',
		},
		createdAt: {
			type: 'number',
		},
		totalQuantity: {
			type: 'number',
		},
		purchasedQuantity: {
			type: 'number',
		},
		unit: {
			type: 'string',
		},
		food: {
			type: 'string',
		},
		sortKey: {
			type: 'string',
		},
	},
	required: [
		'id',
		'categoryId',
		'createdAt',
		'totalQuantity',
		'purchasedQuantity',
		'unit',
		'food',
		'sortKey',
	],
	indexes: ['categoryId', 'food'],
} as const;
const itemSchemaTyped = toTypedRxJsonSchema(itemSchemaLiteral);
export type GroceryItem = ExtractDocumentTypeFromTypedRxJsonSchema<
	typeof itemSchemaTyped
>;
const itemSchema = itemSchemaLiteral as RxJsonSchema<GroceryItem>;

type Database = RxDatabase<{
	categories: RxCollection<GroceryCategory>;
	foodCategoryLookups: RxCollection<FoodCategoryLookup>;
	items: RxCollection<GroceryItem>;
	inputs: RxCollection<GroceryInput>;
}>;

export class GroceryListDb {
	ready: Promise<Database>;

	constructor() {
		this.ready = this.init();
	}

	get categories() {
		return this.ready.then((db) => db.categories);
	}
	get foodCategoryLookups() {
		return this.ready.then((db) => db.foodCategoryLookups);
	}
	get items() {
		return this.ready.then((db) => db.items);
	}
	get inputs() {
		return this.ready.then((db) => db.inputs);
	}

	private init = async () => {
		const db: Database = await createRxDatabase({
			name: 'groceries-rx',
			storage: getRxStorageDexie(),
		});
		await db.addCollections({
			categories: {
				schema: categorySchema,
			},
			foodCategoryLookups: {
				schema: foodCategoryLookupSchema,
			},
			items: {
				schema: itemSchema,
			},
			inputs: {
				schema: inputSchema,
			},
		});
		return db;
	};

	setItemPurchasedQuantity = async (
		item: RxDocument<GroceryItem>,
		quantity: number,
	) => {
		await item.atomicPatch({
			purchasedQuantity: quantity,
		});
	};

	setItemCategory = async (item: RxDocument<GroceryItem>, categoryId: ID) => {
		await Promise.all([
			item.atomicPatch({
				categoryId,
			}),
			(async () => {
				const db = await this.ready;
				return db.foodCategoryLookups.upsert({
					foodName: item.food,
					categoryId,
				});
			})(),
		]);
	};

	addItems = async (lines: string[]) => {
		if (!lines.length) return;
		const db = await this.ready;
		const defaultCategory = await db.categories.upsert({
			id: DEFAULT_CATEGORY,
			name: DEFAULT_CATEGORY,
		});

		for (const line of lines) {
			const parsed = parseIngredient(line);
			let itemId: string;
			const firstMatch = await db.items
				.findOne({
					selector: {
						food: parsed.food,
					},
				})
				.exec();
			if (firstMatch) {
				itemId = firstMatch.id;
				totalQuantity: firstMatch.totalQuantity + parsed.quantity,
					await firstMatch.atomicPatch({});
			} else {
				itemId = cuid();

				const lookup = await db.foodCategoryLookups
					.findOne({
						selector: {
							foodName: parsed.food,
						},
					})
					.exec();
				const categoryId = lookup?.categoryId ?? defaultCategory.id;

				const lastCategoryItem = await db.items
					.findOne({
						selector: {
							categoryId,
						},
						sort: [
							{
								sortKey: 'desc',
							},
						],
					})
					.exec();

				await db.items.insert({
					id: itemId,
					categoryId,
					createdAt: Date.now(),
					totalQuantity: parsed.quantity,
					purchasedQuantity: 0,
					unit: parsed.unit,
					food: parsed.food,
					sortKey: generateKeyBetween(lastCategoryItem?.sortKey ?? null, null),
				});
			}
			assert(itemId);
			await db.inputs.insert({
				id: cuid(),
				itemId,
				text: line,
			});
		}
	};

	createCategory = async (name: string) => {
		const db = await this.ready;
		return db.categories.insert({
			name,
			id: cuid(),
		});
	};

	deleteItem = async (item: RxDocument<GroceryItem>) => {
		await item.remove();
	};

	deleteItems = async (itemIds: string[]) => {
		const db = await this.ready;
		return db.items.bulkRemove(itemIds);
	};

	updateItem = async (
		item: RxDocument<GroceryItem>,
		update: Partial<GroceryItem>,
	) => {
		await item.atomicPatch(update);
	};

	/**
	 * A very basic useQuery hook with no loading state which
	 * suspends.
	 */
	useQuery = <Result>(
		creator: (db: Database) => RxQuery<Result, RxDocument<Result>[]>,
		deps: any[] = [],
	) => {
		const db = suspend(() => this.ready, ['database']);
		// TODO: lost in hooks dep confusion...
		const creatorRef = useRef(creator);
		creatorRef.current = creator;
		const creatorCallback = useCallback(
			(db: Database) => creatorRef.current(db),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			deps,
		);
		const query = creatorCallback(db);
		// TODO: is this a good cache key?
		const firstValue = suspend(() => query.exec(), [query._creationTime]);
		const [value, setValue] = useState(firstValue);
		useEffect(() => {
			const sub = query.$.subscribe((result) => {
				setValue(result);
			});
			return () => {
				sub.unsubscribe();
			};
		}, [query]);

		return value;
	};
}

export const groceries = new GroceryListDb();
