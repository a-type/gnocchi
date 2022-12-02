import { createContext, useContext } from 'react';

export const ListContext = createContext<string | null | undefined>(undefined);

export function useListId() {
	const listId = useContext(ListContext);
	return listId;
}
