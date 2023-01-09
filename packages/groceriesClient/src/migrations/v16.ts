import v15Schema from '../client/schemaVersions/v15.js';
import v16Schema from '../client/schemaVersions/v16.js';
import { migrate } from '@lo-fi/web';
import { readRawIdb } from '../../src/readRawIdb.js';

export default migrate(
	v15Schema,
	v16Schema,
	async ({ migrate, withDefaults, mutations }) => {
		// add or modify migration logic here
		// if a line has a type error, that indicates the shape of your models may have changed
		await migrate('categories', (old) => withDefaults('categories', old));
		await migrate('items', (old) => withDefaults('items', old));
		await migrate('foodCategoryAssignments', (old) =>
			withDefaults('foodCategoryAssignments', old),
		);
		await migrate('suggestions', (old) => withDefaults('suggestions', old));
		await migrate('lists', (old) => withDefaults('lists', old));
		await migrate('collaborationInfo', (old) =>
			withDefaults('collaborationInfo', old),
		);

		// load recipes from the recipes database into the groceries database
		// - this migration consolidates both into one library

		try {
			await readRawIdb('recipes_collections', 7, 'recipes', async (recipe) => {
				await mutations.recipes.put(recipe);
			});
		} catch (e) {
			console.error('Error migrating recipes', e);
		}
	},
);
