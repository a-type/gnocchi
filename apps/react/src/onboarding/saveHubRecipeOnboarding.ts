import { createOnboarding } from './createOnboarding.js';

export const saveHubRecipeOnboarding = createOnboarding('saveHubRecipe', [
	'save',
	'recipe',
	'addToList',
	'viewList',
	'subscribe',
] as const);
