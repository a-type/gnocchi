import { API_HOST_HTTP } from '@/config.js';
import { ClientDescriptor, Presence } from './client/index.js';
import migrations from './migrations/index.js';

export const recipesDescriptor = new ClientDescriptor({
	sync: {
		authEndpoint: `${API_HOST_HTTP}/api/auth/lofi`,
		initialPresence: {} as Presence,
	},
	migrations,
	namespace: 'recipes',
});
recipesDescriptor.open();

export { hooks } from './client/react.js';
export type {
	Recipe,
	RecipeIngredients,
	RecipeIngredientsItem,
	RecipeIngredientsItemComments,
} from './client/index.js';
