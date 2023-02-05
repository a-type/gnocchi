import { proxy } from 'valtio';

export const recipesCollectionState = proxy({
	tagFilter: null as string | null,
});
