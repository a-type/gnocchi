import { RxDocument } from 'rxdb';
import { GroceryItem } from 'stores/groceries/db';

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
	value: RxDocument<GroceryItem>;
	nextSortKey: string | null;
	prevSortKey: string | null;
};
