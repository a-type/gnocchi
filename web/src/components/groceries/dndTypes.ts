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
	  };
