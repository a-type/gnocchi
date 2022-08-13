import GroceryItem from 'stores/groceries/.generated/GroceryItem';

export type GroceryDnDDrop =
	| {
			type: 'category';
			value: any;
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
	value: GroceryItem;
	nextSortKey: string | null;
	prevSortKey: string | null;
};
