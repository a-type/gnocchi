import { Item } from '@aglio/groceries-client';

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
