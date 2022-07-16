import { useGroceryList, useGroceryListCtx } from 'contexts/GroceryListContext';
import React, { useEffect } from 'react';
import { addItems } from 'stores/groceries/mutations';

export function ShareTargetListener() {
	const ctx = useGroceryListCtx();
	const list = useGroceryList();
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.toString());
			const add = url.searchParams.get('add');
			if (add) {
				window.history.replaceState(null, '', window.location.pathname);
				addItems(ctx, list.id, add.split('\n'));
			}
		}
	}, [ctx, list]);
}
