import {
	CreateArgs,
	DeleteArgs,
	SetSortKeyArgs,
	SetTotalQuantityArgs,
} from './GroceryItemMutations.js';
import { SetPurchasedQuantityArgs } from './GroceryItemMutations.js';
import { SetCategoryArgs } from './GroceryItemMutations.js';
import { Changeset, sid } from '@aphro/runtime-ts';
import { Data } from './GroceryItem.js';
import GroceryItem from './GroceryItem.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export function createImpl(
	mutator: Omit<IMutationBuilder<GroceryItem, Data>, 'toChangeset'>,
	{
		listId,
		categoryId,
		createdAt,
		totalQuantity,
		purchasedQuantity,
		unit,
		name,
		sortKey,
	}: CreateArgs,
): void | Changeset<any>[] {
	mutator.set({
		id: sid('AAAA'),
		listId,
		categoryId,
		createdAt,
		totalQuantity,
		purchasedQuantity,
		unit,
		name,
		sortKey,
	});
}

export function setPurchasedQuantityImpl(
	mutator: Omit<IMutationBuilder<GroceryItem, Data>, 'toChangeset'>,
	{ purchasedQuantity }: SetPurchasedQuantityArgs,
): void | Changeset<any>[] {
	mutator.set({
		purchasedQuantity,
	});
}

export function setCategoryImpl(
	mutator: Omit<IMutationBuilder<GroceryItem, Data>, 'toChangeset'>,
	{ categoryId }: SetCategoryArgs,
): void | Changeset<any>[] {
	mutator.set({
		categoryId,
	});
}

export function deleteImpl(
	mutator: Omit<IMutationBuilder<GroceryItem, Data>, 'toChangeset'>,
	{}: DeleteArgs,
): void | Changeset<any>[] {}

export function setTotalQuantityImpl(
	mutator: Omit<IMutationBuilder<GroceryItem, Data>, 'toChangeset'>,
	{ totalQuantity }: SetTotalQuantityArgs,
): void | Changeset<any>[] {
	mutator.set({
		totalQuantity,
	});
}

export function setSortKeyImpl(
	mutator: Omit<IMutationBuilder<GroceryItem, Data>, 'toChangeset'>,
	{ sortKey }: SetSortKeyArgs,
): void | Changeset<any>[] {
	mutator.set({
		sortKey,
	});
}
