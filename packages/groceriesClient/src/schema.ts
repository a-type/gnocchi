import { schema } from '@verdant-web/store';
import cuid from 'cuid';
import { categories } from './schema/categories.js';
import { items } from './schema/items.js';
import { foods } from './schema/foods.js';
import { lists } from './schema/lists.js';
import { collaborationInfo } from './schema/collaborationInfo.js';
import { recipes } from './schema/recipes.js';
import { recipeTagMetadata } from './schema/recipeTagMetadata.js';

export default schema({
	version: 41,
	collections: {
		categories,
		items,
		foods,
		lists,
		collaborationInfo,
		recipes,
		recipeTagMetadata,
	},
});
