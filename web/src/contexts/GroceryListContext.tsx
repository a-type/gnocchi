import { Context } from '@aphro/runtime-ts';
import { createContext, useContext } from 'react';
import GroceryList from 'stores/groceries/.generated/GroceryList';

export const GroceryListContext = createContext(
	null as unknown as { list: GroceryList; ctx: Context },
);

export function useGroceryList() {
	return useContext(GroceryListContext).list;
}

export function useGroceryListCtx() {
	return useContext(GroceryListContext).ctx;
}
