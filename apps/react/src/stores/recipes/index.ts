import { API_HOST_HTTP } from '@/config.js';
import { ClientDescriptor } from './client/index.js';
import migrations from './migrations/index.js';

export interface Profile {}
export interface Presence {}

export const recipesDescriptor = new ClientDescriptor<Presence, Profile>({
	sync: {
		authEndpoint: `${API_HOST_HTTP}/api/lofi/recipes`,
		initialPresence: {},
		defaultProfile: {},
	},
	migrations,
	namespace: 'recipes',
});
recipesDescriptor.open().then((client) => {
	(window as any).recipes = client;
});

import { createHooks } from './client/react.js';
export const hooks = createHooks<Presence, Profile>();
export type {
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItem,
	RecipeIngredientsItemComments,
} from './client/index.js';

export * as mutations from './mutations.js';
