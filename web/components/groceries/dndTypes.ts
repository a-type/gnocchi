export type GroceryDnDDrop =
	| {
			type: 'category';
			value: string;
	  }
	| {
			type: 'new';
	  };
