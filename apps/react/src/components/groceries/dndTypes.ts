import { Item } from '@/stores/groceries/index.js';

export type GroceryDnDDrop =
	| {
			type: 'category';
			value: string | null;
	  }
	| {
			type: 'new';
	  }
	| {
			type: 'delete';
	  }
	| GroceryDnDDrag;

export type GroceryDnDDrag = {
	type: 'item';
	value: Item;
};
