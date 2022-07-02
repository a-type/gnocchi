import { proxy } from 'valtio';
import { bindProxyAndYMap } from 'valtio-yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from 'yjs';

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

const doc = new Y.Doc();

export const groceriesStore = proxy({
	items: new Array<GroceryItemData>(),
});

bindProxyAndYMap(groceriesStore, doc.getMap('root'));

// persist to local indexdb
const indexDbProvider = new IndexeddbPersistence('groceries', doc as any);

if (typeof window !== 'undefined') {
	(window as any).groceriesStore = groceriesStore;
}
