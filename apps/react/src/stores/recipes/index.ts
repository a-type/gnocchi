import { API_HOST_HTTP } from '@/config.js';
import { ClientDescriptor } from './client/index.js';
import migrations from './migrations/index.js';

export interface Profile {}
export interface Presence {}

export const recipesDescriptor = new ClientDescriptor({
	sync: {
		authEndpoint: `${API_HOST_HTTP}/api/auth/lofi`,
		initialPresence: {} as Presence,
		defaultProfile: {} as Profile,
	},
	migrations,
	namespace: 'recipes',
});
recipesDescriptor.open();

import { createHooks } from './client/react.js';
export const hooks = createHooks<Presence, Profile>();
export type {
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItem,
	RecipeIngredientsItemComments,
} from './client/index.js';
