import { API_HOST_HTTP } from '@/config.js';
import { ClientDescriptor } from './client/index.js';
import migrations from './migrations/index.js';
import { createHooks } from './client/react.js';
import { Profile } from '../groceries/index.js';

export type { Profile };

export interface Presence {
	viewingRecipeId: string | null;
}

export const recipesDescriptor = new ClientDescriptor<Presence, Profile>({
	sync: {
		authEndpoint: `${API_HOST_HTTP}/api/lofi/recipes`,
		initialPresence: {
			viewingRecipeId: null,
		},
		defaultProfile: {
			id: '',
			name: '',
		},
		automaticTransportSelection: false,
		initialTransport: 'pull',
		pullInterval: 15000,
	},
	migrations,
	namespace: 'recipes',
});
recipesDescriptor.open().then((client) => {
	(window as any).recipes = client;
});

export const hooks = createHooks<Presence, Profile>();
export type {
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItem,
	RecipeIngredientsItemComments,
} from './client/index.js';

export * as mutations from './mutations.js';
