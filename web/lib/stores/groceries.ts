import { proxy, subscribe } from 'valtio';
import { derive, proxyWithComputed } from 'valtio/utils';
import { bindProxyAndYMap } from 'valtio-yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

export const NONE_CATEGORY = 'None';

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

export type GroceryInputData = {
	text: string;
};

const groceryListDoc = new Y.Doc();

function enforceConsistency() {
	for (const item of groceriesStore.items) {
		if (!item.category) {
			item.category = NONE_CATEGORY;
		}

		if (groceriesStore.categories.indexOf(item.category) === -1) {
			groceriesStore.categories.unshift(item.category);
		}
	}
}

if (typeof window !== 'undefined') {
	const indexDbProvider = new IndexeddbPersistence(
		'groceries',
		groceryListDoc as any,
	);
	indexDbProvider.on('synced', () => {
		enforceConsistency();
		subscribe(groceriesStore.items, () => {
			enforceConsistency();
		});
	});
}

export const groceriesStore = proxy({
	items: [] as GroceryItemData[],
	categories: [] as string[],
});

if (typeof window !== 'undefined') {
	bindProxyAndYMap(groceriesStore, groceryListDoc.getMap('root'));

	(window as any).groceriesStore = groceriesStore;
}

const categoryLookupDoc = new Y.Doc();

if (typeof window !== 'undefined') {
	const indexDbProvider = new IndexeddbPersistence(
		'categoryLookup',
		categoryLookupDoc as any,
	);
}

export const categoryLookupStore = proxy({
	table: {} as { [key: string]: string },
});

if (typeof window !== 'undefined') {
	bindProxyAndYMap(categoryLookupStore, categoryLookupDoc.getMap('root'));

	(window as any).categoryLookup = categoryLookupStore;
}

export function setItemCategory(item: GroceryItemData, category: string) {
	item.category = category;
	categoryLookupStore.table[item.name] = category;
}
